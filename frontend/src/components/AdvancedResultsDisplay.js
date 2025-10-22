import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBarChart2, 
  FiCode, 
  FiTable, 
  FiTag, 
  FiTrendingUp,
  FiAlertTriangle,
  FiZap,
  FiDownload,
  FiCopy,
  FiCheckCircle
} from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import QualityScoreCard from './QualityScoreCard';
import IssuesList from './IssuesList';
import SuggestionsList from './SuggestionsList';
import SecurityConcernsList from './SecurityConcernsList';
import MaintainabilityCard from './MaintainabilityCard';

const AdvancedResultsDisplay = ({ results, onExport }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const { 
    cleaned_code, 
    constants, 
    keywords, 
    identifiers, 
    operators, 
    symbol_table, 
    statistics,
    complexity_metrics,
    visualization_data,
    syntax_errors,
    ai_analysis
  } = results;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const StatCard = ({ title, value, icon, gradient, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white/20 rounded-full p-3">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const sections = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'complexity', label: 'Complexity', icon: FiTrendingUp },
    { id: 'ai', label: 'AI Insights', icon: FiZap },
    { id: 'errors', label: 'Errors', icon: FiAlertTriangle },
    { id: 'cleaned', label: 'Cleaned Code', icon: FiCode },
    { id: 'symbol', label: 'Symbol Table', icon: FiTable },
    { id: 'tokens', label: 'Tokens', icon: FiTag },
    { id: 'charts', label: 'Charts', icon: FiBarChart2 }
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FiCheckCircle className="w-8 h-8" />
              Analysis Complete
            </h2>
            <p className="text-indigo-100">Your code has been thoroughly analyzed with AI insights</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onExport(results)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lines"
          value={statistics?.total_lines || 0}
          gradient="from-blue-500 to-blue-600"
          icon={<FiCode className="w-6 h-6" />}
        />
        <StatCard
          title="Total Tokens"
          value={statistics?.total_tokens || 0}
          gradient="from-purple-500 to-purple-600"
          icon={<FiTag className="w-6 h-6" />}
        />
        <StatCard
          title="Complexity"
          value={complexity_metrics?.cyclomatic_complexity || 0}
          gradient="from-orange-500 to-red-500"
          icon={<FiTrendingUp className="w-6 h-6" />}
          subtitle="Cyclomatic"
        />
        <StatCard
          title="Functions"
          value={complexity_metrics?.function_count || 0}
          gradient="from-green-500 to-emerald-600"
          icon={<FiBarChart2 className="w-6 h-6" />}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 min-w-max px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <section.icon className="w-4 h-4" />
                {section.label}
              </div>
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Overview</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🔑</span>
                      Keywords Found
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {keywords?.slice(0, 15).map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-lg text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                      {keywords?.length > 15 && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                          +{keywords.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🔢</span>
                      Constants Found
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {constants?.slice(0, 15).map((constant, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-lg text-sm font-medium">
                          {constant}
                        </span>
                      ))}
                      {constants?.length > 15 && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                          +{constants.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚙️</span>
                    Top Operators
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {operators?.slice(0, 12).map((operator, index) => (
                      <span key={index} className="px-3 py-1 bg-green-200 text-green-900 rounded-lg text-sm font-medium">
                        {operator}
                      </span>
                    ))}
                    {operators?.length > 12 && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                        +{operators.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Complexity Section */}
            {activeSection === 'complexity' && (
              <motion.div
                key="complexity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Complexity Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Cyclomatic Complexity</h4>
                    <p className="text-3xl font-bold text-red-600">
                      {complexity_metrics?.cyclomatic_complexity || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {complexity_metrics?.cyclomatic_complexity <= 10 ? 'Low complexity' : 
                       complexity_metrics?.cyclomatic_complexity <= 20 ? 'Moderate complexity' : 'High complexity'}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Function Count</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {complexity_metrics?.function_count || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Functions detected</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Comment Density</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {complexity_metrics?.comment_density?.toFixed(1) || 0}%
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Documentation level</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Insights Section */}
            {activeSection === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiZap className="w-6 h-6 text-yellow-500" />
                  AI Analysis & Insights
                </h3>
                
                {ai_analysis?.error ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800">
                      <strong>Note:</strong> {ai_analysis.error}
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      To enable AI analysis, please configure your Gemini API key in the backend.
                    </p>
                  </div>
                ) : (
                  (() => {
                    let aiData = null;
                    let isJson = false;
                    
                    // Robust JSON parsing function that handles Markdown code blocks
                    const cleanAndParseJson = (str) => {
                      try {
                        // Remove ```json at start, ``` at start, and ``` at end
                        const cleaned = str.replace(/^```json\s*/, '')
                                           .replace(/^```\s*/, '')
                                           .replace(/\s*```$/, '')
                                           .trim();
                        return JSON.parse(cleaned);
                      } catch (e) {
                        console.error("Failed to clean and parse JSON:", e);
                        return null;
                      }
                    };

                    // Determine which data to use and try to parse it
                    if (ai_analysis?.ai_analysis && typeof ai_analysis.ai_analysis === 'object') {
                        aiData = ai_analysis.ai_analysis;
                        isJson = true;
                    } else if (typeof ai_analysis?.ai_analysis === 'string') {
                        aiData = cleanAndParseJson(ai_analysis.ai_analysis);
                        isJson = !!aiData;
                    } else if (typeof ai_analysis === 'string') {
                        aiData = cleanAndParseJson(ai_analysis);
                        isJson = !!aiData;
                    } else if (ai_analysis && typeof ai_analysis === 'object' && ai_analysis.quality_score) {
                        aiData = ai_analysis;
                        isJson = true;
                    }

                    if (isJson && aiData) {
                      return (
                        <div className="space-y-6">
                          <QualityScoreCard score={aiData.quality_score} />
                          <IssuesList issues={aiData.issues} />
                          <SuggestionsList suggestions={aiData.suggestions} />
                          <SecurityConcernsList concerns={aiData.security_concerns} />
                          <MaintainabilityCard maintainability={aiData.maintainability} />
                        </div>
                      );
                    }

                    // Fallback for plain text response or failed parse
                    return (
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                            {typeof ai_analysis === 'string' ? ai_analysis : 
                             ai_analysis?.ai_analysis || 
                             JSON.stringify(ai_analysis, null, 2) || 
                             'AI analysis not available'}
                          </pre>
                        </div>
                      </div>
                    );
                  })()
                )}
              </motion.div>
            )}

            {/* Syntax Errors Section */}
            {activeSection === 'errors' && (
              <motion.div
                key="errors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiAlertTriangle className="w-6 h-6 text-red-500" />
                  Syntax Error Detection
                </h3>
                
                {syntax_errors?.length === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-green-800">No Syntax Errors Found!</h4>
                        <p className="text-green-700">Your code appears to be syntactically correct.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {syntax_errors?.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <FiAlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                          <p className="text-red-800 text-sm">{error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Charts Section */}
            {activeSection === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Visualization</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Token Distribution Pie Chart */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Token Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Keywords', value: statistics?.keywords_count || 0 },
                            { name: 'Constants', value: statistics?.constants_count || 0 },
                            { name: 'Identifiers', value: statistics?.identifiers_count || 0 },
                            { name: 'Operators', value: statistics?.operators_count || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2, 3].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Operator Frequency Bar Chart */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Operator Frequency</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Object.entries(visualization_data?.operator_frequency || {}).slice(0, 10).map(([name, value]) => ({ name, value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cleaned Code Section */}
            {activeSection === 'cleaned' && (
              <motion.div
                key="cleaned"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiCode className="w-6 h-6" />
                    Cleaned Code
                  </h3>
                  <button
                    onClick={() => copyToClipboard(cleaned_code, 'Cleaned code')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto shadow-inner">
                  <pre className="text-green-400 text-sm font-mono leading-relaxed">
                    <code>{cleaned_code || 'No code to display'}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Symbol Table Section */}
            {activeSection === 'symbol' && (
              <motion.div
                key="symbol"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiTable className="w-6 h-6" />
                  Symbol Table
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Token</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Occurrences</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {symbol_table && symbol_table.length > 0 ? (
                          symbol_table.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                                {entry.token}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  entry.type === 'Keyword' ? 'bg-blue-100 text-blue-800' :
                                  entry.type === 'Identifier' ? 'bg-green-100 text-green-800' :
                                  entry.type.includes('Constant') ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {entry.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded-full font-medium">
                                  {entry.count}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                              No entries in symbol table
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Tokens Section */}
            {activeSection === 'tokens' && (
              <motion.div
                key="tokens"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiTag className="w-6 h-6" />
                  All Tokens by Category
                </h3>

                {/* Keywords */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Keywords ({keywords?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {keywords?.length > 0 ? (
                      keywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-lg text-sm font-medium">
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No keywords found</p>
                    )}
                  </div>
                </div>

                {/* Constants */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Constants ({constants?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {constants?.length > 0 ? (
                      constants.map((constant, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-lg text-sm font-medium">
                          {constant}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No constants found</p>
                    )}
                  </div>
                </div>

                {/* Identifiers */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Identifiers ({identifiers?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {identifiers?.length > 0 ? (
                      identifiers.map((identifier, index) => (
                        <span key={index} className="px-3 py-1 bg-green-200 text-green-900 rounded-lg text-sm font-medium">
                          {identifier}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No identifiers found</p>
                    )}
                  </div>
                </div>

                {/* Operators */}
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Operators ({operators?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {operators?.length > 0 ? (
                      operators.map((operator, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-200 text-orange-900 rounded-lg text-sm font-medium">
                          {operator}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No operators found</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedResultsDisplay;