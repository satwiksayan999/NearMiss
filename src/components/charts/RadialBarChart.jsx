import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const RadialBarChartComponent = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No Data Available</p>
      </div>
    );
  }

  const chartData = Object.entries(data)
    .map(([name, value], index) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      value,
      fill: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="20%" 
        outerRadius="80%" 
        data={chartData}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar 
          minAngle={15} 
          label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }} 
          background 
          dataKey="value"
        />
        <Legend 
          iconSize={12}
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default RadialBarChartComponent;
