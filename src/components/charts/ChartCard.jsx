import React from 'react';

const ChartCard = ({ title, children, icon }) => {
  return (
    <div className="chart-card group relative bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h3>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
      
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/30 to-transparent rounded-bl-full"></div>
    </div>
  );
};

export default ChartCard;
