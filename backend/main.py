from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import re
import uvicorn
import google.generativeai as genai
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
# import matplotlib.pyplot as plt
# import seaborn as sns
# import plotly.graph_objects as go
# import plotly.express as px
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import tempfile

app = FastAPI(title="Source Code Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*","https://source-code-lexer.vercel.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str
    language: str

class TranslationInput(BaseModel):
    code: str
    source_language: str
    target_language: str

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY and GEMINI_API_KEY != 'your-gemini-api-key-here':
    genai.configure(api_key=GEMINI_API_KEY)
    print(f"✅ Gemini AI configured successfully!")
else:
    print("⚠️  Gemini API key not found in environment variables") 

def remove_comments_and_whitespace(content: str) -> str:
    """Remove comments and extra whitespace from source code"""

    content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
    
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        cleaned_line = line.strip()
        if cleaned_line:  
            cleaned_lines.append(cleaned_line)
    
    return '\n'.join(cleaned_lines)

def extract_constants(content: str) -> list:
    """Extract constants from source code"""
    constants = []
    
    # Integer constants (but not in variable names)
    int_pattern = r'(?<![a-zA-Z_])\d+(?![a-zA-Z_])'
    constants.extend(re.findall(int_pattern, content))
    
    # Float constants
    float_pattern = r'(?<![a-zA-Z_])\d+\.\d+(?![a-zA-Z_])'
    constants.extend(re.findall(float_pattern, content))
    
    # String literals
    string_pattern = r'"[^"]*"'
    constants.extend(re.findall(string_pattern, content))
    
    # Character literals
    char_pattern = r"'[^']*'"
    constants.extend(re.findall(char_pattern, content))
    
    # Boolean constants
    bool_pattern = r'\b(true|false)\b'
    constants.extend(re.findall(bool_pattern, content, re.IGNORECASE))
    
    return list(set(constants))  

def extract_keywords(content: str) -> list:
    """Extract keywords from source code"""
    cpp_keywords = [
        'auto', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
        'delete', 'do', 'else', 'enum', 'extern', 'for', 'friend', 'goto', 'if',
        'inline', 'int', 'long', 'namespace', 'new', 'operator', 'private', 'protected',
        'public', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
        'struct', 'switch', 'template', 'this', 'throw', 'try', 'typedef', 'union',
        'unsigned', 'virtual', 'void', 'volatile', 'while', 'bool', 'char', 'double',
        'float', 'string', 'vector', 'map', 'set', 'list', 'include', 'using'
    ]
    
    java_keywords = [
        'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
        'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
        'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
        'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
        'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
        'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
        'try', 'void', 'volatile', 'while', 'true', 'false', 'null'
    ]
    
    all_keywords = cpp_keywords + java_keywords
    found_keywords = []
    
    for keyword in all_keywords:
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, content, re.IGNORECASE):
            found_keywords.append(keyword)
    
    return list(set(found_keywords))  # Remove duplicates

def extract_identifiers(content: str) -> list:
    """Extract identifiers (variable names, function names, etc.) from source code"""
    # More precise identifier pattern - excludes numbers and common operators
    identifier_pattern = r'\b[a-zA-Z_][a-zA-Z0-9_]*\b'
    identifiers = re.findall(identifier_pattern, content)
    
    keywords = extract_keywords(content)
    constants = extract_constants(content)
    
    # Additional filtering to exclude common non-identifier patterns
    excluded_patterns = [
        r'^[0-9]+$',  # Pure numbers
        r'^[a-zA-Z]+[0-9]+$',  # Words followed by numbers (like variable1)
        r'^[0-9]+[a-zA-Z]+$',  # Numbers followed by words
    ]
    
    # Exclude words that appear in string literals
    string_content = re.findall(r'"[^"]*"', content)
    string_words = set()
    for string_literal in string_content:
        # Extract words from string literals
        words = re.findall(r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', string_literal)
        string_words.update(words)
    
    filtered_identifiers = []
    for identifier in identifiers:
        # Check if it's not a keyword, constant, excluded pattern, or from string literals
        is_excluded = any(re.match(pattern, identifier) for pattern in excluded_patterns)
        
        if (identifier not in keywords and 
            identifier not in constants and 
            identifier not in string_words and
            not is_excluded and
            len(identifier) > 1):  # Exclude single letters that might be operators
            filtered_identifiers.append(identifier)
    
    return list(set(filtered_identifiers))  

def extract_operators(content: str) -> list:
    """Extract operators from source code"""
    operators = [
        '+', '-', '*', '/', '%',  # Arithmetic
        '=', '==', '!=', '<', '>', '<=', '>=',  # Assignment and comparison
        '&&', '||', '!',  # Logical
        '&', '|', '^', '~', '<<', '>>',  # Bitwise
        '++', '--',  # Increment/decrement
        '+=', '-=', '*=', '/=', '%=',  # Compound assignment
        '?', ':',  # Ternary
        '->', '.', '::',  # Member access
        '(', ')', '[', ']', '{', '}',  # Brackets
        ',', ';'  # Separators
    ]
    
    found_operators = []
    for operator in operators:
        if operator in content:
            count = content.count(operator)
            if count > 0:
                found_operators.append(f"{operator} (used {count} times)")
    
    return found_operators

def generate_symbol_table(content: str) -> list:
    """Generate a symbol table with tokens and their types"""
    symbol_table = []
    keywords = extract_keywords(content)
    constants = extract_constants(content)
    identifiers = extract_identifiers(content)
    
    token_dict = {}
    
    for keyword in keywords:
        if keyword not in token_dict:
            token_dict[keyword] = {"token": keyword, "type": "Keyword", "count": content.count(keyword)}
    
    for constant in constants:
        if constant not in token_dict:
            if constant.startswith('"'):
                const_type = "String Constant"
            elif constant.startswith("'"):
                const_type = "Character Constant"            
            else:
                const_type = "Integer Constant"
            
            token_dict[constant] = {"token": constant, "type": const_type, "count": content.count(constant)}
    
    for identifier in identifiers:
        if identifier not in token_dict:
            token_dict[identifier] = {"token": identifier, "type": "Identifier", "count": content.count(identifier)}
    
    symbol_table = list(token_dict.values())
    
    return symbol_table

def calculate_cyclomatic_complexity(content: str) -> int:
    """Calculate cyclomatic complexity"""
    complexity = 1  # Base complexity
    complexity += content.count('if') + content.count('while') + content.count('for')
    complexity += content.count('case') + content.count('catch')
    complexity += content.count('&&') + content.count('||')
    complexity += content.count('?')  # Ternary operator
    return complexity

def count_functions(content: str) -> int:
    """Count function definitions"""
    # C++ function patterns
    cpp_pattern = r'\b\w+\s+\w+\s*\([^)]*\)\s*\{'
    # Java method patterns
    java_pattern = r'\b(public|private|protected|static)?\s*\w+\s+\w+\s*\([^)]*\)\s*\{'
    
    cpp_functions = len(re.findall(cpp_pattern, content))
    java_functions = len(re.findall(java_pattern, content))
    
    return max(cpp_functions, java_functions)

def detect_syntax_errors(content: str, language: str) -> list:
    """Detect common syntax errors"""
    errors = []
    
    # Check for unmatched brackets
    bracket_pairs = {'(': ')', '[': ']', '{': '}'}
    stack = []
    
    for i, char in enumerate(content):
        if char in bracket_pairs:
            stack.append((char, i))
        elif char in bracket_pairs.values():
            if not stack:
                errors.append(f"Unmatched closing bracket '{char}' at position {i}")
            else:
                open_bracket, _ = stack.pop()
                if bracket_pairs[open_bracket] != char:
                    errors.append(f"Mismatched brackets: '{open_bracket}' and '{char}' at position {i}")
    
    # Check for unmatched opening brackets
    for bracket, pos in stack:
        errors.append(f"Unmatched opening bracket '{bracket}' at position {pos}")
    
    # Check for missing semicolons (basic check)
    lines = content.split('\n')
    for i, line in enumerate(lines):
        line = line.strip()
        if line and not line.endswith((';', '{', '}', '//', '/*', '*/')):
            if re.search(r'\b(int|float|double|char|string|bool)\s+\w+\s*=', line):
                if not line.endswith(';'):
                    errors.append(f"Missing semicolon at line {i+1}")
    
    return errors

def calculate_comment_density(content: str) -> float:
    """Calculate comment density percentage"""
    total_lines = len(content.split('\n'))
    comment_lines = 0
    
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('//') or line.startswith('/*') or line.startswith('*'):
            comment_lines += 1
    
    return (comment_lines / total_lines * 100) if total_lines > 0 else 0

def analyze_code_with_ai(code: str, language: str) -> dict:
    """Use Gemini AI for advanced code analysis"""
    if GEMINI_API_KEY == 'your-gemini-api-key-here':
        return {"error": "Gemini API key not configured"}
    
    try:
        # Use only gemini-2.5-flash model
        model_names = ['gemini-2.5-flash']
        model = None
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                # Test if model is available by making a simple request
                test_response = model.generate_content("Hello")
                print(f"✅ Using model: {model_name}")
                break
            except Exception as e:
                print(f"❌ Model {model_name} not available: {str(e)}")
                continue
        
        if not model:
            return {"error": "No compatible Gemini model found. Available models may have changed."}
        
        prompt = f"""
        Analyze this {language} code and provide a comprehensive analysis:
        
        Code:
        {code}
        
        Please provide:
        1. Code quality score (1-10)
        2. Main issues or potential bugs
        3. Performance suggestions
        4. Best practices recommendations
        5. Security considerations
        6. Code maintainability assessment
        
        Format your response as JSON with these keys:
        - quality_score: number
        - issues: array of strings
        - suggestions: array of strings
        - security_concerns: array of strings
        - maintainability: string
        """
        
        response = model.generate_content(prompt)
        
        # Try to parse the response as JSON, if it fails return as text
        try:
            ai_data = json.loads(response.text)
            return {"ai_analysis": ai_data}
        except json.JSONDecodeError:
            return {"ai_analysis": response.text}
    except Exception as e:
        return {"error": f"AI analysis failed: {str(e)}"}

def translate_code(code: str, source_lang: str, target_lang: str) -> dict:
    """Translate code between C++ and Java using Gemini"""
    if GEMINI_API_KEY == 'your-gemini-api-key-here':
        return {"error": "Gemini API key not configured"}
    
    try:
        # Try different model names in order of preference
        model_names = ['gemini-2.5-flash']
        model = None
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                # Test if model is available by making a simple request
                test_response = model.generate_content("Hello")
                print(f"✅ Using model for translation: {model_name}")
                break
            except Exception as e:
                print(f"❌ Model {model_name} not available: {str(e)}")
                continue
        
        if not model:
            return {"error": "No compatible Gemini model found for translation."}
        
        prompt = f"""
        Translate this {source_lang} code to {target_lang}:
        
        {code}
        
        Requirements:
        1. Maintain the same functionality
        2. Use proper {target_lang} syntax and conventions
        3. Include necessary imports/includes
        4. Add comments explaining the translation
        5. Ensure the code compiles and runs correctly
        
        Provide only the translated code without additional explanations.
        """
        
        response = model.generate_content(prompt)
        return {"translated_code": response.text}
    except Exception as e:
        return {"error": f"Translation failed: {str(e)}"}

def create_visualization_data(content: str) -> dict:
    """Create data for token distribution visualization"""
    constants = extract_constants(content)
    keywords = extract_keywords(content)
    identifiers = extract_identifiers(content)
    operators = extract_operators(content)
    
    # Token distribution
    token_data = {
        "labels": ["Keywords", "Constants", "Identifiers", "Operators"],
        "values": [len(keywords), len(constants), len(identifiers), len(operators)],
        "colors": ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"]
    }
    
    # Operator frequency
    operator_freq = {}
    for op in operators:
        # Extract operator name and count from format "operator (used X times)"
        if ' (used ' in op:
            op_name = op.split(' (used ')[0]
            count_str = op.split(' (used ')[1].replace(' times)', '')
            count = int(count_str)
        else:
            op_name = op
            count = 1
        operator_freq[op_name] = operator_freq.get(op_name, 0) + count
    
    return {
        "token_distribution": token_data,
        "operator_frequency": operator_freq,
        "complexity_metrics": {
            "cyclomatic_complexity": calculate_cyclomatic_complexity(content),
            "function_count": count_functions(content),
            "comment_density": calculate_comment_density(content)
        }
    }

def analyze_code(content: str) -> dict:
    """Main function to analyze source code"""
    cleaned_code = remove_comments_and_whitespace(content)
    constants = extract_constants(content)
    keywords = extract_keywords(content)
    identifiers = extract_identifiers(content)
    operators = extract_operators(content)
    symbol_table = generate_symbol_table(content)
    
    # Advanced metrics
    complexity_metrics = {
        "cyclomatic_complexity": calculate_cyclomatic_complexity(content),
        "function_count": count_functions(content),
        "comment_density": calculate_comment_density(content)
    }
    
    stats = {
        "total_lines": len(content.split('\n')),
        "total_tokens": len(keywords) + len(constants) + len(identifiers),
        "keywords_count": len(keywords),
        "constants_count": len(constants),
        "identifiers_count": len(identifiers),
        "operators_count": len(operators)
    }
    
    return {
        "cleaned_code": cleaned_code,
        "constants": constants,
        "keywords": keywords,
        "identifiers": identifiers,
        "operators": operators,
        "symbol_table": symbol_table,
        "statistics": stats,
        "complexity_metrics": complexity_metrics,
        "visualization_data": create_visualization_data(content)
    }

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    """Analyze uploaded source code file"""
    
    if not (file.filename.endswith('.cpp') or file.filename.endswith('.java')):
        raise HTTPException(status_code=400, detail="Only .cpp and .java files are supported")
    
    try:
        # Read file content
        content = await file.read()
        content_str = content.decode('utf-8')
        
        return analyze_code(content_str)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/analyze-code")
async def analyze_pasted_code(code_input: CodeInput):
    """Analyze pasted source code"""
    
    if code_input.language not in ['cpp', 'java']:
        raise HTTPException(status_code=400, detail="Only C++ and Java are supported")
    
    try:
        return analyze_code(code_input.code)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing code: {str(e)}")

@app.post("/analyze-advanced")
async def analyze_advanced(code_input: CodeInput):
    """Advanced analysis with AI insights"""
    try:
        # Basic analysis
        basic_analysis = analyze_code(code_input.code)
        
        # Syntax error detection
        syntax_errors = detect_syntax_errors(code_input.code, code_input.language)
        
        # AI analysis
        ai_analysis = analyze_code_with_ai(code_input.code, code_input.language)
        
        return {
            **basic_analysis,
            "syntax_errors": syntax_errors,
            "ai_analysis": ai_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in advanced analysis: {str(e)}")

@app.post("/translate")
async def translate_code_endpoint(translation_input: TranslationInput):
    """Translate code between C++ and Java"""
    try:
        result = translate_code(
            translation_input.code,
            translation_input.source_language,
            translation_input.target_language
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

@app.post("/export-pdf")
async def export_pdf(code_input: CodeInput):
    """Export analysis results as PDF"""
    try:
        analysis = analyze_code(code_input.code)
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        # Create PDF
        doc = SimpleDocTemplate(temp_file.name, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph("Source Code Analysis Report", title_style))
        story.append(Spacer(1, 20))
        
        # Statistics
        story.append(Paragraph("Statistics", styles['Heading2']))
        stats_data = [
            ['Metric', 'Value'],
            ['Total Lines', str(analysis['statistics']['total_lines'])],
            ['Total Tokens', str(analysis['statistics']['total_tokens'])],
            ['Keywords', str(analysis['statistics']['keywords_count'])],
            ['Constants', str(analysis['statistics']['constants_count'])],
            ['Identifiers', str(analysis['statistics']['identifiers_count'])],
            ['Operators', str(analysis['statistics']['operators_count'])]
        ]
        
        stats_table = Table(stats_data)
        stats_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(stats_table)
        story.append(Spacer(1, 20))
        
        # Complexity Metrics
        story.append(Paragraph("Complexity Metrics", styles['Heading2']))
        complexity_data = [
            ['Metric', 'Value'],
            ['Cyclomatic Complexity', str(analysis['complexity_metrics']['cyclomatic_complexity'])],
            ['Function Count', str(analysis['complexity_metrics']['function_count'])],
            ['Comment Density', f"{analysis['complexity_metrics']['comment_density']:.1f}%"]
        ]
        
        complexity_table = Table(complexity_data)
        complexity_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(complexity_table)
        story.append(Spacer(1, 20))
        
        # Keywords
        story.append(Paragraph("Keywords Found", styles['Heading2']))
        keywords_text = ", ".join(analysis['keywords'][:20])  # Limit to first 20
        if len(analysis['keywords']) > 20:
            keywords_text += f" ... and {len(analysis['keywords']) - 20} more"
        story.append(Paragraph(keywords_text, styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Constants
        story.append(Paragraph("Constants Found", styles['Heading2']))
        constants_text = ", ".join(analysis['constants'][:20])  # Limit to first 20
        if len(analysis['constants']) > 20:
            constants_text += f" ... and {len(analysis['constants']) - 20} more"
        story.append(Paragraph(constants_text, styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Identifiers
        story.append(Paragraph("Identifiers Found", styles['Heading2']))
        identifiers_text = ", ".join(analysis['identifiers'][:20])  # Limit to first 20
        if len(analysis['identifiers']) > 20:
            identifiers_text += f" ... and {len(analysis['identifiers']) - 20} more"
        story.append(Paragraph(identifiers_text, styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Cleaned Code
        story.append(Paragraph("Cleaned Code", styles['Heading2']))
        # Truncate cleaned code if too long
        cleaned_code = analysis['cleaned_code']
        if len(cleaned_code) > 1000:
            cleaned_code = cleaned_code[:1000] + "\n... (truncated for PDF)"
        story.append(Paragraph(f"<pre>{cleaned_code}</pre>", styles['Code']))
        
        # Footer
        story.append(Spacer(1, 20))
        story.append(Paragraph(f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 
                              ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, alignment=1)))
        
        doc.build(story)
        
        return FileResponse(
            temp_file.name,
            media_type='application/pdf',
            filename=f'code_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Advanced Source Code Analyzer API with AI Integration"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
