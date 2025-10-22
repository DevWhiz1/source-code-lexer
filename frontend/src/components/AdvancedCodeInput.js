import React, { useState, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiCode, 
  FiFileText, 
  FiDownload, 
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiZap,
  FiGlobe
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdvancedCodeInput = ({ onAnalyze, onAdvancedAnalyze, onTranslate, onExport, loading, error }) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [translationMode, setTranslationMode] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('java');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        const ext = file.name.split('.').pop().toLowerCase();
        setLanguage(ext === 'java' ? 'java' : 'cpp');
        toast.success('File loaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = (type = 'basic') => {
    if (!code.trim()) {
      toast.error('Please enter some code first!');
      return;
    }

    if (type === 'advanced') {
      onAdvancedAnalyze({ code, language });
    } else {
      onAnalyze({ type: 'paste', code, language });
    }
  };

  const handleTranslate = () => {
    if (!code.trim()) {
      toast.error('Please enter some code first!');
      return;
    }
    onTranslate({ 
      code, 
      source_language: language, 
      target_language: targetLanguage 
    });
  };

  const handleExport = () => {
    if (!code.trim()) {
      toast.error('Please enter some code first!');
      return;
    }
    onExport({ code, language });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.cpp') || file.name.endsWith('.java')) {
        handleFileChange({ target: { files: [file] } });
      } else {
        toast.error('Please upload .cpp or .java files only!');
      }
    }
  };

  const sampleCodes = {
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int i = 0; i < numbers.size(); i++) {
        sum += numbers[i];
    }
    
    cout << "Sum: " << sum << endl;
    return 0;
}`,
    java: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        numbers.add(1);
        numbers.add(2);
        numbers.add(3);
        numbers.add(4);
        numbers.add(5);
        
        int sum = 0;
        for (int number : numbers) {
            sum += number;
        }
        
        System.out.println("Sum: " + sum);
    }
}`
  };

  const loadSampleCode = () => {
    setCode(sampleCodes[language]);
    toast.success('Sample code loaded!');
  };

  const clearCode = () => {
    setCode('');
    toast.success('Code cleared!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Advanced Code Analyzer</h2>
            <p className="text-indigo-100">AI-powered analysis with intelligent insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 rounded-full p-2">
              <FiZap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { id: 'editor', label: 'Code Editor', icon: FiCode },
          { id: 'upload', label: 'Upload File', icon: FiUpload },
          { id: 'translate', label: 'Translate', icon: FiGlobe }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Language Selection and Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                  <button
                    onClick={loadSampleCode}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={clearCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <Editor
                  height="400px"
                  language={language}
                  value={code}
                  onChange={setCode}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    lineNumbers: 'on',
                    folding: true,
                    bracketPairColorization: { enabled: true },
                    guides: {
                      bracketPairs: true,
                      indentation: true
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleAnalyze('basic')}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Basic Analysis
                </button>
                
                <button
                  onClick={() => handleAnalyze('advanced')}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FiZap className="w-4 h-4" />
                  AI Analysis
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FiDownload className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors bg-gray-50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".cpp,.java"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FiUpload className="w-10 h-10 text-indigo-600" />
                  </div>
                  
                  <div>
                    <button
                      onClick={handleButtonClick}
                      disabled={loading}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                        loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {loading ? 'Processing...' : 'Choose File'}
                    </button>
                    <p className="text-sm text-gray-500 mt-3">or drag and drop your file here</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">.cpp</span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">.java</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'translate' && (
            <motion.div
              key="translate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiGlobe className="w-5 h-5 text-blue-600" />
                  Code Translation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleTranslate}
                  disabled={loading || !code.trim()}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
                    loading || !code.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      <span>Translating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FiGlobe className="w-4 h-4" />
                      <span>Translate Code</span>
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FiRefreshCw className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
              <p className="text-blue-800 text-sm font-medium">Analyzing your code...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCodeInput;
