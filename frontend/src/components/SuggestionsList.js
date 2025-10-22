import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const SuggestionsList = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <FiCheckCircle className="w-6 h-6 text-green-500" />
        <h4 className="text-lg font-semibold text-gray-800">Improvement Suggestions</h4>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {suggestions.length}
        </span>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsList;
