import React, { useState } from 'react';

const ResultsDisplay = ({ results }) => {
  const { cleaned_code, constants, keywords, identifiers, operators, symbol_table, statistics } = results;
  const [activeSection, setActiveSection] = useState('overview');

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg transform transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-white/20 rounded-full p-3">
          {icon}
        </div>
      </div>
    </div>
  );

  const TokenBadge = ({ item, color = 'blue' }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-${color}-100 text-${color}-800 border border-${color}-200`}>
      {item}
    </span>
  );

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'cleaned', label: 'Cleaned Code', icon: '✨' },
    { id: 'symbol', label: 'Symbol Table', icon: '📋' },
    { id: 'tokens', label: 'Tokens', icon: '🔤' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Analysis Complete ✓</h2>
        <p className="text-blue-100">Your source code has been successfully analyzed. Explore the results below.</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Lines"
            value={statistics.total_lines}
            gradient="from-blue-500 to-blue-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Total Tokens"
            value={statistics.total_tokens}
            gradient="from-purple-500 to-purple-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Keywords"
            value={statistics.keywords_count}
            gradient="from-green-500 to-green-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Constants"
            value={statistics.constants_count}
            gradient="from-yellow-500 to-orange-500"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Identifiers"
            value={statistics.identifiers_count}
            gradient="from-pink-500 to-red-500"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
          />
          <StatCard
            title="Operators"
            value={statistics.operators_count}
            gradient="from-indigo-500 to-purple-600"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 min-w-max px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🔑</span>
                    Keywords Found
                  </h4>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {keywords.slice(0, 15).map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-lg text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                    {keywords.length > 15 && (
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
                    {constants.slice(0, 15).map((constant, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-lg text-sm font-medium">
                        {constant}
                      </span>
                    ))}
                    {constants.length > 15 && (
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
                  {operators.slice(0, 12).map((operator, index) => (
                    <span key={index} className="px-3 py-1 bg-green-200 text-green-900 rounded-lg text-sm font-medium">
                      {operator}
                    </span>
                  ))}
                  {operators.length > 12 && (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                      +{operators.length - 12} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cleaned Code Section */}
          {activeSection === 'cleaned' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Cleaned Code (Comments & Whitespace Removed)
              </h3>
              <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto shadow-inner">
                <pre className="text-green-400 text-sm font-mono leading-relaxed">
                  <code>{cleaned_code || 'No code to display'}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Symbol Table Section */}
          {activeSection === 'symbol' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Symbol Table
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Occurrences
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {symbol_table && symbol_table.length > 0 ? (
                        symbol_table.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
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
            </div>
          )}

          {/* All Tokens Section */}
          {activeSection === 'tokens' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔤</span>
                All Tokens by Category
              </h3>

              {/* Keywords */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Keywords ({keywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keywords.length > 0 ? (
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
                  Constants ({constants.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {constants.length > 0 ? (
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
                  Identifiers ({identifiers.length})
                </h4>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                  {identifiers.length > 0 ? (
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
                  Operators ({operators.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {operators.length > 0 ? (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
