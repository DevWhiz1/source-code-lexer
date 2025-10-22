import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const IssuesList = ({ issues }) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <FiAlertTriangle className="w-6 h-6 text-red-500" />
        <h4 className="text-lg font-semibold text-gray-800">Issues Found</h4>
        <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {issues.length}
        </span>
      </div>
      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{issue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesList;
