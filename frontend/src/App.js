import React, { useState } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedCodeInput from './components/AdvancedCodeInput';
import AdvancedResultsDisplay from './components/AdvancedResultsDisplay';
import { 
  FiZap, 
  FiCode, 
  FiBarChart2, 
  FiDownload, 
  FiGlobe, 
  FiShield,
  FiTrendingUp,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.VITE_API_URL || 'https://source-code-lexer.vercel.app';

function App() {
  const [results, setResults] = useState(null);
  const [translatedCode, setTranslatedCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartNew = () => {
    setResults(null);
    setTranslatedCode(null);
    setLoading(false);
  };
  const [error, setError] = useState(null);

  const handleAnalyze = async (input) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setTranslatedCode(null);

    try {
      if (input.type === 'file') {
        // File upload
        const formData = new FormData();
        formData.append('file', input.data);
        
      const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        setResults(response.data);
        toast.success('Basic analysis completed!');
      } else if (input.type === 'paste') {
        // Pasted code
        console.log('Making basic analysis request:', { code: input.code, language: input.language });
        const response = await axios.post(`${API_BASE_URL}/analyze-code`, {
          code: input.code,
          language: input.language,
        });
        console.log('Basic analysis response:', response.data);
        setResults(response.data);
        toast.success('Basic analysis completed!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error analyzing code. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedAnalyze = async (input) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setTranslatedCode(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-advanced`, {
        code: input.code,
        language: input.language,
      });
      setResults(response.data);
      toast.success('Advanced AI analysis completed!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error in advanced analysis. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (input) => {
    setLoading(true);
    setError(null);
    setTranslatedCode(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        code: input.code,
        source_language: input.source_language,
        target_language: input.target_language,
      });
      setTranslatedCode(response.data);
      toast.success('Code translation completed!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error translating code. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (results) => {
    try {
      // Extract the original code from results or use a placeholder
      const code = results?.cleaned_code || '// Code analysis results\n// Original code not available';
      const language = 'cpp'; // Default language, could be made dynamic
      
      console.log('Exporting PDF with code:', code);
      
      const response = await axios.post(`${API_BASE_URL}/export-pdf`, {
        code: code,
        language: language,
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `code_analysis_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error('Export error:', err);
      const errorMsg = err.response?.data?.detail || 'Error exporting PDF. Please try again.';
      toast.error(errorMsg);
    }
  };

  const features = [
    {
      icon: FiCode,
      title: "Advanced Lexical Analysis",
      description: "Comprehensive token extraction with whitespace removal, comment stripping, and symbol table generation",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: FiZap,
      title: "AI-Powered Insights",
      description: "Gemini AI integration for code quality analysis, bug detection, and improvement suggestions",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: FiBarChart2,
      title: "Complexity Metrics",
      description: "Cyclomatic complexity, function count, comment density, and performance analysis",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: FiShield,
      title: "Syntax Error Detection",
      description: "Automatic detection of common syntax errors, unmatched brackets, and missing semicolons",
      gradient: "from-red-500 to-red-600"
    },
    {
      icon: FiGlobe,
      title: "Code Translation",
      description: "AI-powered translation between C++ and Java with proper syntax and conventions",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: FiDownload,
      title: "Export & Reports",
      description: "Generate comprehensive PDF reports with statistics, charts, and analysis results",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: FiTrendingUp,
      title: "Data Visualization",
      description: "Interactive charts and graphs for token distribution and operator frequency analysis",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: FiEye,
      title: "Interactive Editor",
      description: "Monaco Editor integration with syntax highlighting, auto-completion, and real-time analysis",
      gradient: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-6 backdrop-blur-sm"
            >
              <FiZap className="w-12 h-12" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-extrabold mb-4 tracking-tight"
            >
              AI Code Analyzer
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8"
            >
              Advanced lexical analysis with AI-powered insights, code translation, and comprehensive reporting
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">C++ Support</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Java Support</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">AI Analysis</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Code Translation</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">PDF Export</span>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Features Showcase */}
        {!results && !translatedCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-7xl mx-auto mb-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Comprehensive code analysis with cutting-edge AI technology and modern visualization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!results && !translatedCode && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 1.0 }}
              >
                <AdvancedCodeInput 
                  onAnalyze={handleAnalyze}
                  onAdvancedAnalyze={handleAdvancedAnalyze}
                  onTranslate={handleTranslate}
                  onExport={handleExport}
            loading={loading}
            error={error}
          />
              </motion.div>
            )}
          
          {results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <AdvancedResultsDisplay 
                  results={results} 
                  onExport={handleExport}
                  onStartNew={handleStartNew}
                />
              </motion.div>
            )}

            {translatedCode && (
              <motion.div
                key="translation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiGlobe className="w-6 h-6 text-blue-600" />
                    Translated Code
                  </h2>
                  
                  {translatedCode.error ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <p className="text-yellow-800">
                        <strong>Note:</strong> {translatedCode.error}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
                      <pre className="text-green-400 text-sm font-mono leading-relaxed">
                        <code>{translatedCode.translated_code}</code>
                      </pre>
                    </div>
                  )}
                  
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(translatedCode.translated_code);
                        toast.success('Translated code copied to clipboard!');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      Copy Code
                    </button>
                    <button
                      onClick={() => {
                        setTranslatedCode(null);
                        setResults(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back to Analysis
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Code Analyzer</h3>
              <p className="text-gray-400 text-sm">
                Advanced lexical analysis with AI-powered insights and comprehensive reporting capabilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Lexical Analysis</li>
                <li>• AI Code Review</li>
                <li>• Code Translation</li>
                <li>• Complexity Metrics</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Supported Languages</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• C++ (.cpp)</li>
                <li>• Java (.java)</li>
                <li>• More coming soon...</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Code Analyzer - Built with ❤️ using React, FastAPI, and Google Gemini AI By Ahmad Bajwa </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
