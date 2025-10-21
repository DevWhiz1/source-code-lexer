import React, { useState, useRef } from 'react';

const CodeInput = ({ onAnalyze, loading, error }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [pastedCode, setPastedCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onAnalyze({ type: 'file', data: file });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasteAnalyze = () => {
    if (pastedCode.trim()) {
      onAnalyze({ type: 'paste', data: { code: pastedCode, language } });
    }
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
        onAnalyze({ type: 'file', data: file });
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
          </div>
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === 'paste'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Paste Code
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'upload' ? (
          <div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-3 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors bg-gray-50"
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <button
                    onClick={handleButtonClick}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                      loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
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
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Language
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paste Your Code
              </label>
              <textarea
                value={pastedCode}
                onChange={(e) => setPastedCode(e.target.value)}
                placeholder="Paste your C++ or Java code here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                disabled={loading}
              />
            </div>

            <button
              onClick={handlePasteAnalyze}
              disabled={loading || !pastedCode.trim()}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
                loading || !pastedCode.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze Code'
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 text-sm font-medium">Analyzing your code...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeInput;

