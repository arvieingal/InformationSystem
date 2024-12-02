"use client"
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios'; // Assuming you have an axios instance configured

interface ChildGrowthData {
  nutritionalStatus: string;
  immunizationRecords: any[]; // Define a proper type based on your data structure
}

const ChildHistory = () => {
  const [childGrowthData, setChildGrowthData] = useState<ChildGrowthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildGrowthData = async () => {
      try {
        const response = await api.get('/api/child-growth-data'); // Adjust the endpoint as needed
        setChildGrowthData(response.data);
      } catch (error) {
        setError('Failed to fetch child growth data.');
      }
    };

    fetchChildGrowthData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!childGrowthData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Child History</h1>
      <div>
        <h2>Nutritional Status</h2>
        <p>{childGrowthData.nutritionalStatus}</p>
      </div>
      <div>
        <h2>Immunization Records</h2>
        <ul>
          {childGrowthData.immunizationRecords.map((record, index) => (
            <li key={index}>
              {/* Render immunization record details here */}
              {record.vaccineType} - {record.dateVaccinated}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChildHistory;
