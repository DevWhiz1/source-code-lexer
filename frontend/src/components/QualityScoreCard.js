import React from 'react';

const QualityScoreCard = ({ score }) => {
  if (!score) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{score}</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Quality Score</h4>
          <p className="text-gray-600">Out of 10</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QualityScoreCard;
