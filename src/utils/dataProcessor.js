/**
 * Data processing utilities for incident data
 * Handles missing/empty fields gracefully by replacing with "Unknown"
 */

/**
 * Maps severity level numbers to readable labels
 */
const getSeverityLabel = (severity) => {
  const severityMap = {
    0: 'None',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical',
  };
  if (typeof severity === 'number' && severityMap.hasOwnProperty(severity)) {
    return severityMap[severity];
  }
  return severity?.toString() || 'Unknown';
};

/**
 * Converts timestamp to Date object
 */
const parseDate = (dateValue) => {
  if (!dateValue) return null;
  
  // If it's a timestamp (number)
  if (typeof dateValue === 'number') {
    return new Date(dateValue);
  }
  
  // If it's a string, try to parse it
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  return null;
};

/**
 * Normalizes a value, replacing null, undefined, or empty strings with "Unknown"
 */
const normalizeValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Unknown';
  }
  return value;
};

/**
 * Normalizes an entire incident object
 */
const normalizeIncident = (incident) => {
  const date = parseDate(incident?.incident_date);
  const year = incident?.year || (date ? date.getFullYear() : null);
  const month = incident?.month || (date ? date.getMonth() + 1 : null);
  
  return {
    id: normalizeValue(incident?.id || incident?.incident_number),
    incident_date: date || null,
    incident_date_timestamp: incident?.incident_date || null,
    year: year || null,
    month: month || null,
    severity_level: incident?.severity_level !== undefined && incident?.severity_level !== null 
      ? incident.severity_level 
      : 'Unknown',
    severity_label: getSeverityLabel(incident?.severity_level),
    action_cause: normalizeValue(incident?.action_cause),
    location: normalizeValue(incident?.location),
    region: normalizeValue(incident?.region),
    behavior_type: normalizeValue(incident?.behavior_type || incident?.unsafe_condition_or_behavior),
    primary_category: normalizeValue(incident?.primary_category),
    job: normalizeValue(incident?.job),
    gbu: normalizeValue(incident?.gbu),
  };
};

/**
 * Normalizes an array of incidents
 */
export const normalizeData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeIncident);
};

/**
 * Groups data by a specific field
 */
export const groupByField = (data, field) => {
  if (!Array.isArray(data) || !field) return {};
  
  return data.reduce((acc, item) => {
    const key = normalizeValue(item?.[field]);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Counts incidents by month and year
 */
export const countByMonth = (data) => {
  if (!Array.isArray(data)) return [];
  
  const monthCounts = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  data.forEach((item) => {
    let monthYear = null;
    
    // Use year and month fields if available
    if (item?.year && item?.month) {
      const monthName = monthNames[item.month - 1] || `Month ${item.month}`;
      monthYear = `${monthName} ${item.year}`;
    } else if (item?.incident_date) {
      // Fallback to parsing the date
      const date = item.incident_date instanceof Date ? item.incident_date : parseDate(item.incident_date);
      if (date && !isNaN(date.getTime())) {
        monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      }
    }
    
    if (monthYear) {
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    }
  });
  
  // Convert to array and sort by date
  return Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      // Parse month year strings for sorting
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateA - dateB;
      }
      return a.month.localeCompare(b.month);
    });
};

/**
 * Gets top locations with most incidents
 */
export const getTopLocations = (data, limit = 10) => {
  if (!Array.isArray(data)) return [];
  
  const locationCounts = groupByField(data, 'location');
  
  return Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Calculates KPIs from the data
 */
export const calculateKPIs = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalIncidents: 0,
      highestSeverityCount: 0,
      highestSeverityLevel: 'Unknown',
      mostCommonActionCause: 'Unknown',
      mostCommonLocation: 'Unknown',
    };
  }
  
  const totalIncidents = data.length;
  
  // Get severity distribution - use severity_label for display
  const severityCounts = {};
  data.forEach((item) => {
    const label = item?.severity_label || getSeverityLabel(item?.severity_level) || 'Unknown';
    severityCounts[label] = (severityCounts[label] || 0) + 1;
  });
  const highestSeverity = Object.entries(severityCounts)
    .sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];
  
  // Get most common action cause
  const actionCauseCounts = groupByField(data, 'action_cause');
  const mostCommonActionCause = Object.entries(actionCauseCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  
  // Get most common location
  const locationCounts = groupByField(data, 'location');
  const mostCommonLocation = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  
  return {
    totalIncidents,
    highestSeverityCount: highestSeverity[1],
    highestSeverityLevel: highestSeverity[0],
    mostCommonActionCause,
    mostCommonLocation,
  };
};

/**
 * Filters data by year
 */
export const filterByYear = (data, year) => {
  if (!Array.isArray(data) || !year || year === 'All') return data;
  
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) return data;
  
  return data.filter((item) => {
    // Use year field if available
    if (item?.year !== undefined && item?.year !== null) {
      return item.year === yearNum;
    }
    
    // Fallback to parsing date
    const date = item?.incident_date instanceof Date 
      ? item.incident_date 
      : parseDate(item?.incident_date);
    
    if (date && !isNaN(date.getTime())) {
      return date.getFullYear() === yearNum;
    }
    
    return false;
  });
};

/**
 * Filters data by severity level
 */
export const filterBySeverity = (data, severity) => {
  if (!Array.isArray(data) || !severity || severity === 'All') return data;
  
  return data.filter((item) => {
    const itemSeverityLabel = item?.severity_label || getSeverityLabel(item?.severity_level);
    return itemSeverityLabel === severity;
  });
};

/**
 * Gets unique years from the data
 */
export const getUniqueYears = (data) => {
  if (!Array.isArray(data)) return [];
  
  const years = new Set();
  data.forEach((item) => {
    // Use year field if available
    if (item?.year !== undefined && item?.year !== null) {
      years.add(item.year);
    } else {
      // Fallback to parsing date
      const date = item?.incident_date instanceof Date 
        ? item.incident_date 
        : parseDate(item?.incident_date);
      
      if (date && !isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    }
  });
  
  return Array.from(years).sort((a, b) => b - a);
};

/**
 * Gets unique severity levels from the data
 */
export const getUniqueSeverities = (data) => {
  if (!Array.isArray(data)) return [];
  
  const severities = new Set();
  data.forEach((item) => {
    const severityLabel = item?.severity_label || getSeverityLabel(item?.severity_level);
    severities.add(severityLabel);
  });
  
  // Sort by severity level (None, Low, Medium, High, Critical)
  const severityOrder = ['None', 'Low', 'Medium', 'High', 'Critical', 'Unknown'];
  return Array.from(severities).sort((a, b) => {
    const indexA = severityOrder.indexOf(a);
    const indexB = severityOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

/**
 * Gets incidents by behavior type
 */
export const getBehaviorTypeData = (data) => {
  return groupByField(data, 'behavior_type');
};

/**
 * Gets incidents by job/project
 */
export const getJobData = (data) => {
  return groupByField(data, 'job');
};

/**
 * Gets severity distribution by month for stacked chart
 */
export const getSeverityByMonth = (data) => {
  if (!Array.isArray(data)) return [];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthData = {};
  
  data.forEach((item) => {
    let monthYear = null;
    
    if (item?.year && item?.month) {
      const monthName = monthNames[item.month - 1] || `Month ${item.month}`;
      monthYear = `${monthName} ${item.year}`;
    } else if (item?.incident_date) {
      const date = item.incident_date instanceof Date ? item.incident_date : parseDate(item.incident_date);
      if (date && !isNaN(date.getTime())) {
        monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      }
    }
    
    if (monthYear) {
      if (!monthData[monthYear]) {
        monthData[monthYear] = { name: monthYear, None: 0, Low: 0, Medium: 0, High: 0, Critical: 0, Unknown: 0 };
      }
      const severityLabel = item?.severity_label || getSeverityLabel(item?.severity_level) || 'Unknown';
      monthData[monthYear][severityLabel] = (monthData[monthYear][severityLabel] || 0) + 1;
    }
  });
  
  return Object.values(monthData).sort((a, b) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateA - dateB;
    }
    return a.name.localeCompare(b.name);
  });
};
