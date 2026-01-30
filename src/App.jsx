import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import incidentsData from './data/incidents.json';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData(incidentsData);
        setError(null);
      } catch (err) {
        setError('Failed to load incident data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-600 mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Dashboard data={data} />
    </div>
  );
}

export default App;
