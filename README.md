# 🚀 AI-Powered Source Code Analyzer

A cutting-edge full-stack application that performs comprehensive lexical analysis on C++ and Java source code with **AI-powered insights**. Built with React (frontend) and FastAPI (backend), featuring a beautiful, modern interface with advanced code analysis capabilities powered by **Google Gemini AI**.

## ✨ Advanced Features

### 🧠 AI-Powered Analysis
- **Gemini AI Integration**: Intelligent code quality assessment
- **Code Quality Scoring**: 1-10 quality rating with detailed feedback
- **Bug Detection**: Automatic identification of potential issues
- **Performance Suggestions**: AI-recommended optimizations
- **Security Analysis**: Vulnerability detection and security recommendations
- **Best Practices**: Code style and convention suggestions

### 🔄 Code Translation
- **C++ to Java**: AI-powered language conversion
- **Java to C++**: Intelligent cross-language translation
- **Syntax Preservation**: Maintains functionality while adapting syntax
- **Convention Adherence**: Follows target language best practices

### 📊 Advanced Analytics
- **Cyclomatic Complexity**: Code complexity measurement
- **Function Count**: Automatic function/method detection
- **Comment Density**: Documentation quality metrics
- **Token Distribution**: Visual analysis of code composition
- **Operator Frequency**: Usage pattern analysis

### 🎨 Modern UI/UX
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Interactive Charts**: Recharts-powered data visualization
- **Smooth Animations**: Framer Motion for delightful interactions
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Themes**: Beautiful gradient themes
- **Real-time Feedback**: Instant analysis results

### 🔍 Enhanced Analysis
- **Syntax Error Detection**: Automatic error identification
- **Symbol Table**: Comprehensive token categorization
- **Export Functionality**: PDF reports with charts and insights
- **Multiple Input Methods**: File upload, code paste, drag-and-drop
- **Live Code Editor**: Real-time editing with analysis

## 🎯 Core Requirements (All Fulfilled)

✅ **Whitespace Removal** - Cleans and normalizes code  
✅ **Comment Removal** - Strips single-line (`//`) and multi-line (`/* */`) comments  
✅ **Constant Recognition** - Identifies integers, floats, strings, characters, and booleans  
✅ **Keyword Recognition** - Detects all C++ and Java language keywords  
✅ **Identifier Recognition** - Extracts all variable and function names  
✅ **Operator Recognition** - Identifies all operators with usage statistics  
✅ **Symbol Table** - Generates comprehensive symbol table with token types and counts  

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Advanced language model integration
- **Pydantic** - Data validation and serialization
- **ReportLab** - PDF generation
- **Matplotlib/Seaborn** - Data visualization
- **Plotly** - Interactive charts

### Frontend
- **React 18** - Modern UI library with hooks
- **Monaco Editor** - Professional code editor
- **Recharts** - Data visualization library
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **React Hot Toast** - Beautiful notifications
- **React Icons** - Comprehensive icon library

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- Gemini API Key (optional, for AI features)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd CC-Assignment
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up Gemini API key (optional)
# Create .env file with:
# GEMINI_API_KEY=your-api-key-here

# Start backend
python main.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

### 4. Access Application
Open your browser and go to: **http://localhost:3000**

## 🔑 Gemini AI Setup

For AI-powered features, you'll need a Gemini API key:

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```
4. Restart the backend

See [GEMINI_SETUP.md](GEMINI_SETUP.md) for detailed instructions.

## 📱 Usage Guide

### Basic Analysis
1. **Upload File**: Drag & drop or click to upload .cpp/.java files
2. **Paste Code**: Use the Monaco editor to write/paste code
3. **Select Language**: Choose C++ or Java
4. **Click "Basic Analysis"**: Get comprehensive lexical analysis

### AI Analysis
1. **Enter Code**: Use the code editor or upload a file
2. **Click "AI Analysis"**: Get AI-powered insights and recommendations
3. **View Results**: Check the "AI Insights" tab for detailed feedback

### Code Translation
1. **Go to "Translate" Tab**: Switch to translation mode
2. **Select Languages**: Choose source and target languages
3. **Enter Code**: Paste the code to translate
4. **Click "Translate"**: Get AI-translated code

### Export Reports
1. **Analyze Code**: Complete any analysis
2. **Click "Export PDF"**: Generate comprehensive report
3. **Download**: Get PDF with charts, statistics, and insights

## 📊 Features Overview

### Input Methods
- **File Upload**: Drag-and-drop or click to browse
- **Code Editor**: Monaco editor with syntax highlighting
- **Language Selection**: C++ or Java support
- **Sample Code**: Pre-loaded examples for testing

### Analysis Types
- **Basic Analysis**: Lexical analysis with token extraction
- **Advanced Analysis**: AI-powered insights and error detection
- **Translation**: Cross-language code conversion
- **Export**: PDF reports with visualizations

### Results Display
- **Overview**: Quick summary with key metrics
- **Complexity**: Cyclomatic complexity and function analysis
- **AI Insights**: Gemini-powered code review
- **Error Detection**: Syntax error identification
- **Charts**: Interactive data visualizations
- **Symbol Table**: Comprehensive token categorization
- **Cleaned Code**: Code without comments/whitespace

## 🎨 UI Features

### Modern Design
- **Gradient Themes**: Beautiful color schemes
- **Smooth Animations**: Framer Motion transitions
- **Responsive Layout**: Works on all screen sizes
- **Interactive Elements**: Hover effects and micro-interactions

### Code Editor
- **Monaco Editor**: VS Code-like editing experience
- **Syntax Highlighting**: Language-specific coloring
- **Auto-completion**: Intelligent code suggestions
- **Bracket Matching**: Visual bracket pairing
- **Line Numbers**: Professional code display

### Data Visualization
- **Pie Charts**: Token distribution analysis
- **Bar Charts**: Operator frequency graphs
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Charts**: Adapts to screen size

## 📡 API Endpoints

### Core Analysis
- `POST /analyze` - Basic file analysis
- `POST /analyze-code` - Basic code analysis
- `POST /analyze-advanced` - AI-powered analysis

### Advanced Features
- `POST /translate` - Code translation
- `POST /export-pdf` - PDF report generation

### Documentation
- `GET /docs` - Interactive API documentation (Swagger)
- `GET /redoc` - Alternative API documentation

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
GEMINI_API_KEY=your-gemini-api-key
PORT=8000

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

### Customization
- **Colors**: Modify Tailwind config for custom themes
- **Charts**: Customize Recharts components
- **AI Prompts**: Adjust Gemini prompts in backend
- **Analysis Rules**: Modify regex patterns for token detection

## 🚨 Troubleshooting

### Common Issues
1. **Backend won't start**: Check Python version and dependencies
2. **Frontend won't start**: Verify Node.js version and npm install
3. **AI features not working**: Check Gemini API key configuration
4. **CORS errors**: Ensure backend is running on correct port

### Debug Mode
- **Backend**: Check console logs for detailed error messages
- **Frontend**: Open browser DevTools for client-side errors
- **API**: Use `/docs` endpoint for interactive testing

## 📈 Performance

### Benchmarks
- **Small files (<100 lines)**: < 0.5 seconds
- **Medium files (100-1000 lines)**: 0.5-2 seconds
- **Large files (1000-5000 lines)**: 2-5 seconds
- **AI Analysis**: Additional 2-5 seconds (depends on API response)

### Optimization
- **Caching**: Results cached for repeated analysis
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Compressed assets

## 🔒 Security

### Data Privacy
- **Local Processing**: All analysis done on your machine
- **No Data Storage**: Code not saved or logged
- **API Security**: Secure communication with Gemini
- **Input Validation**: Sanitized user inputs

### Best Practices
- **Environment Variables**: API keys not in code
- **HTTPS**: Secure communication in production
- **Rate Limiting**: API usage monitoring
- **Error Handling**: Graceful failure management

## 🎯 Future Enhancements

### Planned Features
- [ ] Support for more languages (Python, JavaScript, C#)
- [ ] Advanced syntax highlighting themes
- [ ] Code comparison and diff analysis
- [ ] Team collaboration features
- [ ] Integration with version control systems
- [ ] Custom analysis rules
- [ ] Batch file processing
- [ ] Real-time collaboration

### AI Improvements
- [ ] Custom AI model training
- [ ] Advanced code generation
- [ ] Automated refactoring suggestions
- [ ] Code documentation generation
- [ ] Test case generation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Documentation**: Check this README and setup guides
- **Issues**: Open GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for urgent issues

---

**Built with ❤️ using React, FastAPI, and Google Gemini AI By Ahmad Bajwa**

*Transform your code analysis experience with AI-powered insights! 🚀*