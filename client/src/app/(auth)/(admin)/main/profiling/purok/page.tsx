'use client'
import React, { useEffect, useState } from 'react'
import CardGrid from '@/components/CardGrid'
import { dashboardCards } from '@/constants/cardData'
import { dummyPurokZone } from '@/constants/tableDummyData';
import api from '@/lib/axios';

type PurokPopulation = {
  sitio_purok: string,
  total_count: number,
  resident: number,
  renter: number,
}

const Purok = () => {
  const [purokData, setPurokData] = useState<PurokPopulation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/api/purok-population-by-table');
      const data = response.data;
      setPurokData(data);
    };
    fetchData();
  }, []);

  return (
    <div className='h-full w-full'>
      <CardGrid cards={dashboardCards} />
      <div className="h-[77%] px-44 pb-4">
        <div className="bg-white h-full rounded-[5px]">
          <table className="w-full border-collapse text-[14px]">
            <thead className='text-[#6C6C6C] text-center'>
              <tr className="sticky top-0 bg-white z-10 shadow-gray-300 shadow-sm">
                <th className="py-4 font-semibold w-1/4">
                  Purok / Zone Name
                </th>
                <th className="py-4 font-semibold w-1/4">Population</th>
                <th className="py-4 font-semibold w-1/4">Total Household Number</th>
                <th className="py-4 font-semibold w-1/4">
                  Total Number of Renters
                </th>
              </tr>
            </thead>
            <tbody>
              {purokData.map((purokZone) => (
                <tr key={purokZone.sitio_purok} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-center">{purokZone.sitio_purok}</td>
                  <td className="py-3 text-center text-[#06C46C]">{purokZone.total_count}</td>
                  <td className="py-3 text-center text-[#F4BF42]">{purokZone.resident}</td>
                  <td className="py-3 text-center text-[#F4BF42]">
                    {purokZone.renter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};

export default Purok;