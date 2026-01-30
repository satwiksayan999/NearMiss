import React, { useState, useMemo } from 'react';
import KPICards from '../KPICards/KPICards';
import ChartCard from '../charts/ChartCard';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import LineChart from '../charts/LineChart';
import HorizontalBarChart from '../charts/HorizontalBarChart';
import AreaChart from '../charts/AreaChart';
import StackedBarChart from '../charts/StackedBarChart';
import RadialBarChartComponent from '../charts/RadialBarChart';
import {
  normalizeData,
  groupByField,
  countByMonth,
  getTopLocations,
  filterByYear,
  filterBySeverity,
  getUniqueYears,
  getUniqueSeverities,
  getBehaviorTypeData,
  getJobData,
  getSeverityByMonth,
} from '../../utils/dataProcessor';

const Dashboard = ({ data }) => {
  const normalizedData = useMemo(() => normalizeData(data), [data]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Get filter options
  const availableYears = useMemo(() => ['All', ...getUniqueYears(normalizedData)], [normalizedData]);
  const availableSeverities = useMemo(() => ['All', ...getUniqueSeverities(normalizedData)], [normalizedData]);

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = normalizedData;
    if (selectedYear !== 'All') {
      filtered = filterByYear(filtered, selectedYear);
    }
    if (selectedSeverity !== 'All') {
      filtered = filterBySeverity(filtered, selectedSeverity);
    }
    return filtered;
  }, [normalizedData, selectedYear, selectedSeverity]);

  // Process data for charts
  const actionCauseData = useMemo(() => groupByField(filteredData, 'action_cause'), [filteredData]);
  const severityData = useMemo(() => {
    // Group by severity_label for better display
    const counts = {};
    filteredData.forEach((item) => {
      const label = item?.severity_label || 'Unknown';
      counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
  }, [filteredData]);
  const monthlyData = useMemo(() => countByMonth(filteredData), [filteredData]);
  const topLocations = useMemo(() => getTopLocations(filteredData, 10), [filteredData]);
  const regionData = useMemo(() => groupByField(filteredData, 'region'), [filteredData]);
  const behaviorTypeData = useMemo(() => getBehaviorTypeData(filteredData), [filteredData]);
  const jobData = useMemo(() => getJobData(filteredData), [filteredData]);
  const severityByMonthData = useMemo(() => getSeverityByMonth(filteredData), [filteredData]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700 mb-2">No Data Available</p>
          <p className="text-gray-500">Please ensure incidents.json contains valid data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Near Miss Incident Dashboard
            </h1>
            <p className="text-gray-600 text-lg font-medium">Comprehensive analysis of incident data</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="year-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Filter by Year
              </label>
              <select
                id="year-filter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 font-medium"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="severity-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                ⚠️ Filter by Severity
              </label>
              <select
                id="severity-filter"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 font-medium"
              >
                {availableSeverities.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards data={filteredData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Incidents by Action Cause */}
          <ChartCard title="Incidents by Action Cause" icon="📊">
            <BarChart data={actionCauseData} name="Incidents" color="#3b82f6" />
          </ChartCard>

          {/* Pie Chart - Severity Distribution */}
          <ChartCard title="Severity Distribution" icon="🥧">
            <PieChart data={severityData} />
          </ChartCard>

          {/* Line Chart - Monthly Incident Trend */}
          <ChartCard title="Monthly Incident Trend" icon="📈">
            <LineChart data={monthlyData} name="Incidents" color="#10b981" />
          </ChartCard>

          {/* Area Chart - Monthly Trend (Alternative View) */}
          <ChartCard title="Monthly Trend (Area View)" icon="📉">
            <AreaChart data={monthlyData} name="Incidents" color="#8b5cf6" />
          </ChartCard>

          {/* Horizontal Bar Chart - Top Locations */}
          <ChartCard title="Top Locations with Most Incidents" icon="📍">
            <HorizontalBarChart 
              data={topLocations} 
              dataKey="count" 
              nameKey="location" 
              name="Incidents"
              color="#f59e0b"
            />
          </ChartCard>

          {/* Bar Chart - Incidents by Region */}
          <ChartCard title="Incidents by Region" icon="🌍">
            <BarChart data={regionData} name="Incidents" color="#8b5cf6" />
          </ChartCard>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Stacked Bar Chart - Severity by Month */}
          <ChartCard title="Severity Distribution by Month" icon="📊">
            <StackedBarChart 
              data={severityByMonthData} 
              categories={['None', 'Low', 'Medium', 'High', 'Critical']}
            />
          </ChartCard>

          {/* Radial Bar Chart - Top Action Causes */}
          <ChartCard title="Top Action Causes" icon="🎯">
            <RadialBarChartComponent data={actionCauseData} />
          </ChartCard>
        </div>

        {/* Bottom Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Behavior Type Chart */}
          <ChartCard title="Incidents by Behavior Type" icon="👤">
            <BarChart data={behaviorTypeData} name="Incidents" color="#ec4899" />
          </ChartCard>

          {/* Job/Project Chart */}
          <ChartCard title="Incidents by Job/Project" icon="💼">
            <BarChart data={jobData} name="Incidents" color="#06b6d4" />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
