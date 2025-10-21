from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import uvicorn

app = FastAPI(title="Source Code Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str
    language: str 

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
    
    int_pattern = r'\b\d+\b'
    constants.extend(re.findall(int_pattern, content))
    
    float_pattern = r'\b\d+\.\d+\b'
    constants.extend(re.findall(float_pattern, content))
    
    string_pattern = r'"[^"]*"'
    constants.extend(re.findall(string_pattern, content))
    
    char_pattern = r"'[^']*'"
    constants.extend(re.findall(char_pattern, content))
    
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
    
    return found_keywords

def extract_identifiers(content: str) -> list:
    """Extract identifiers (variable names, function names, etc.) from source code"""
    identifier_pattern = r'\b[a-zA-Z_][a-zA-Z0-9_]*\b'
    identifiers = re.findall(identifier_pattern, content)
    
    keywords = extract_keywords(content)
    constants = extract_constants(content)
    
    filtered_identifiers = []
    for identifier in identifiers:
        if (identifier not in keywords and 
            identifier not in constants and 
            not identifier.isdigit() and
            not re.match(r'^\d', identifier)):
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

def analyze_code(content: str) -> dict:
    """Main function to analyze source code"""
    cleaned_code = remove_comments_and_whitespace(content)
    constants = extract_constants(content)
    keywords = extract_keywords(content)
    identifiers = extract_identifiers(content)
    operators = extract_operators(content)
    symbol_table = generate_symbol_table(content)
    
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
        "statistics": stats
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

@app.get("/")
async def root():
    return {"message": "Source Code Analyzer API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
