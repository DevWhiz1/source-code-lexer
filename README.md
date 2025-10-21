# Source Code Analyzer

This app performs comprehensive lexical analysis on C++ and Java source code.

## ✨ Features

### Core Analysis Capabilities

1. **Whitespace Removal** - Automatically removes unnecessary whitespace and formats code
2. **Comment Removal** - Strips single-line and multi-line comments from source code
3. **Constant Recognition** - Identifies all types of constants:
   - Integer constants
   - Float constants
   - String literals
   - Character literals
   - Boolean constants
4. **Keyword Detection** - Recognizes all C++ and Java language keywords
5. **Identifier Extraction** - Extracts variable names, function names, and custom identifiers
6. **Operator Analysis** - Identifies all operators with usage counts:
   - Arithmetic operators (+, -, *, /, %)
   - Comparison operators (==, !=, <, >, <=, >=)
   - Logical operators (&&, ||, !)
   - Bitwise operators (&, |, ^, ~, <<, >>)
   - And more...
7. **Symbol Table Generation** - Comprehensive symbol table showing:
   - Token names
   - Token types
   - Occurrence counts
   - Categorized by type

### User Interface Features

- **Dual Input Methods**:
  - File upload with drag-and-drop support
  - Direct code paste with language selection
- **Modern Design**: Beautiful gradient themes with smooth animations
- **Interactive Results**: Tabbed interface to explore different aspects of analysis
- **Statistics Dashboard**: Visual cards showing key metrics
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Loading states and error handling

## Project Structure

```
CC-Assignment/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS config
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🚀 Usage

### Method 1: File Upload

1. Start both the backend and frontend servers (see Setup Instructions)
2. Open your browser and navigate to `http://localhost:3000`
3. Select the "Upload File" tab
4. Either:
   - Click "Choose File" and select a .cpp or .java file
   - Drag and drop your file into the upload area
5. The analysis will start automatically

### Method 2: Code Paste

1. Open the application at `http://localhost:3000`
2. Select the "Paste Code" tab
3. Choose your language (C++ or Java)
4. Paste your code into the text area
5. Click "Analyze Code"

### Exploring Results

The analysis results are organized into four main sections:

1. **Overview**: Quick summary with statistics cards showing:
   - Total lines of code
   - Total tokens found
   - Keyword count
   - Constant count
   - Identifier count
   - Operator count

2. **Cleaned Code**: View your code with all comments and unnecessary whitespace removed

3. **Symbol Table**: Comprehensive table showing all tokens with:
   - Token name
   - Token type (Keyword, Identifier, Constant types)
   - Occurrence count

4. **Tokens**: Detailed breakdown of all tokens by category:
   - Keywords
   - Constants
   - Identifiers
   - Operators

## 📡 API Endpoints

### POST /analyze
Uploads and analyzes a source code file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File upload (.cpp or .java)

**Response:**
```json
{
  "cleaned_code": "string",
  "constants": ["string"],
  "keywords": ["string"],
  "identifiers": ["string"],
  "operators": ["string"],
  "symbol_table": [
    {
      "token": "string",
      "type": "string",
      "count": 0
    }
  ],
  "statistics": {
    "total_lines": 0,
    "total_tokens": 0,
    "keywords_count": 0,
    "constants_count": 0,
    "identifiers_count": 0,
    "operators_count": 0
  }
}
```

### POST /analyze-code
Analyzes pasted source code.

**Request:**
- Content-Type: `application/json`
- Body:
```json
{
  "code": "string",
  "language": "cpp" | "java"
}
```

**Response:** Same as `/analyze` endpoint

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern, fast Python web framework
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: Lightning-fast ASGI server
- **Python-multipart**: File upload handling
- **Regex**: Advanced pattern matching for lexical analysis

### Frontend
- **React 18**: Modern JavaScript library with hooks
- **Axios**: Promise-based HTTP client
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Custom Animations**: Smooth transitions and fade-in effects

## 🎯 Requirements Fulfilled

This project fully implements all required compiler design operations:

✅ **Whitespace Removal**: Removes extra whitespace and normalizes code  
✅ **Comment Removal**: Strips both single-line (`//`) and multi-line (`/* */`) comments  
✅ **Constant Recognition**: Identifies integers, floats, strings, characters, and booleans  
✅ **Keyword Recognition**: Detects all C++ and Java language keywords  
✅ **Identifier Recognition**: Extracts all variable and function names  
✅ **Operator Recognition**: Identifies all operators with usage statistics  
✅ **Symbol Table**: Generates comprehensive symbol table with token types and counts  

## 🔧 Development & Extensibility

The application is designed with extensibility in mind:

- **Add New Languages**: Extend keyword lists and regex patterns in `backend/main.py`
- **Enhance UI**: Modify components in `frontend/src/components/`
- **Custom Analysis**: Add new analysis functions in the backend
- **Styling**: Customize colors and themes in `frontend/tailwind.config.js`
- **API Extensions**: Add new endpoints for additional features

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Made with ❤️ by Ahmad Bajwa ##
