'use client'
import React from 'react'
import CardGrid from '@/components/CardGrid'
import { dashboardCards } from '@/constants/cardData'

const Purok = () => {
  const dummyPurokZone = [
    {
      id: 1,
      purokZoneName: 'Abellana',
      population: 540,
      totalHouseholdNumber: 208,
      totalNumberOfRenters: 208,
    },
    {
      id: 2,
      purokZoneName: 'Banilad',
      population: 600,
      totalHouseholdNumber: 250,
      totalNumberOfRenters: 150,
    },
    {
      id: 3,
      purokZoneName: 'Cebu City',
      population: 1200,
      totalHouseholdNumber: 500,
      totalNumberOfRenters: 300,
    },
    {
      id: 4,
      purokZoneName: 'Mandaue',
      population: 800,
      totalHouseholdNumber: 350,
      totalNumberOfRenters: 200,
    },
    {
      id: 5,
      purokZoneName: 'Lapu-Lapu',
      population: 700,
      totalHouseholdNumber: 300,
      totalNumberOfRenters: 180,
    },
  ];

  return (
    <div className='h-full w-full'>
      <CardGrid cards={dashboardCards} />
      <div className="h-[77%] px-44 pb-4">
        <div className="bg-white h-full rounded-[5px] overflow-y-auto overflow-x-hidden">
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
              {dummyPurokZone.map((purokZone) => (
                <tr key={purokZone.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-center">{purokZone.purokZoneName}</td>
                  <td className="py-3 text-center text-[#06C46C]">{purokZone.population}</td>
                  <td className="py-3 text-center text-[#F4BF42]">{purokZone.totalHouseholdNumber}</td>
                  <td className="py-3 text-center text-[#F4BF42]">
                    {purokZone.totalNumberOfRenters}
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