import React from 'react';
import { FiShield } from 'react-icons/fi';

const SecurityConcernsList = ({ concerns }) => {
  if (!concerns || concerns.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <FiShield className="w-6 h-6 text-orange-500" />
        <h4 className="text-lg font-semibold text-gray-800">Security Considerations</h4>
        <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {concerns.length}
        </span>
      </div>
      <div className="space-y-3">
        {concerns.map((concern, index) => (
          <div key={index} className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{concern}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityConcernsList;
