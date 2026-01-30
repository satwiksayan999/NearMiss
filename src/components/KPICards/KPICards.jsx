import React from 'react';
import KPICard from './KPICard';
import { calculateKPIs } from '../../utils/dataProcessor';

const KPICards = ({ data }) => {
  const kpis = calculateKPIs(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Total Incidents"
        value={kpis.totalIncidents.toLocaleString()}
        icon="📊"
        gradient="from-blue-500 to-cyan-500"
      />
      <KPICard
        title="Highest Severity"
        value={kpis.highestSeverityCount.toLocaleString()}
        subtitle={kpis.highestSeverityLevel}
        icon="⚠️"
        gradient="from-amber-500 to-orange-500"
      />
      <KPICard
        title="Most Common Cause"
        value={kpis.mostCommonActionCause.length > 30 ? kpis.mostCommonActionCause.substring(0, 30) + '...' : kpis.mostCommonActionCause}
        icon="🔍"
        gradient="from-purple-500 to-pink-500"
      />
      <KPICard
        title="Most Common Location"
        value={kpis.mostCommonLocation}
        icon="📍"
        gradient="from-green-500 to-emerald-500"
      />
    </div>
  );
};

export default KPICards;
