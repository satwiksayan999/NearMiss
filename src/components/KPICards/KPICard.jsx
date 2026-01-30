import React from 'react';

const KPICard = ({ title, value, subtitle, icon, gradient = 'from-blue-500 to-blue-600' }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`}></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs font-medium text-gray-400 mt-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`ml-4 text-5xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
};

export default KPICard;
