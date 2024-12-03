"use client"
import React from 'react';

interface ChildGrowthData {
  nutritionalStatus: string;
  immunizationRecords: { vaccineType: string; dateVaccinated: string; }[];
}

const staticChildGrowthData: ChildGrowthData = {
  nutritionalStatus: "Healthy",
  immunizationRecords: [
    { vaccineType: "MMR", dateVaccinated: "2023-01-15" },
    { vaccineType: "Polio", dateVaccinated: "2023-02-20" },
    // Add more records as needed
  ],
};

const ChildHistory = () => {
  const childGrowthData = staticChildGrowthData;

  return (
    <div>
      <h1>Child Information</h1>
      <div>
        <h2>Nutritional Status</h2>
        <p>{childGrowthData.nutritionalStatus}</p>
      </div>
      <div>
        <h2>Immunization Records</h2>
        <table>
          <thead>
            <tr>
              <th>Vaccine Type</th>
              <th>Date Vaccinated</th>
            </tr>
          </thead>
          <tbody>
            {childGrowthData.immunizationRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.vaccineType}</td>
                <td>{record.dateVaccinated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChildHistory;
