import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const MaintainabilityCard = ({ maintainability }) => {
  if (!maintainability) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <FiTrendingUp className="w-6 h-6 text-blue-500" />
        <h4 className="text-lg font-semibold text-gray-800">Maintainability Assessment</h4>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <p className="text-gray-700 text-sm leading-relaxed">{maintainability}</p>
      </div>
    </div>
  );
};

export default MaintainabilityCard;
