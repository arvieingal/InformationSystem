'use client'
import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { usePathname } from 'next/navigation';
import CardGrid from '@/components/CardGrid';
import { dashboardCards } from '@/constants/cardData';

interface GenderData {
  male: number;
  female: number;
}

interface VoterData {
  registered: number;
  nonRegistered: number;
}

export default function page() {
  const genderDistribution: GenderData = {
    male: 28130,
    female: 11870
  };

  const voterDistribution: VoterData = {
    registered: 32000,
    nonRegistered: 8000
  };

  const total = genderDistribution.male + genderDistribution.female;
  const malePercentage = (genderDistribution.male / total * 100).toFixed(0);
  const femalePercentage = (genderDistribution.female / total * 100).toFixed(0);

  const voterTotal = voterDistribution.registered + voterDistribution.nonRegistered;
  const registeredPercentage = (voterDistribution.registered / voterTotal * 100).toFixed(0);
  const nonRegisteredPercentage = (voterDistribution.nonRegistered / voterTotal * 100).toFixed(0);

  return (
    <div>
      <CardGrid cards={dashboardCards} />

      <div className='flex flex-col justify-center w-[40rem] bg-white rounded-xl px-16 py-3 mt-[2rem] mx-[4rem]'>
        <div>GENDER</div>
        <div className="flex mt-4 mb-3 h-5 w-full rounded-full bg-green-200 overflow-hidden">
          <div className="bg-[#007F73] h-full" style={{ width: `${malePercentage}%` }}></div>
          <div className="bg-[#B1E5BA] h-full" style={{ width: `${femalePercentage}%` }}></div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-[#007F73]'></div>
            <div className='flex items-center gap-1'><p className='text-[12px]'>Male</p><p className='font-semibold'>{genderDistribution.male.toLocaleString()}</p></div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-[#B1E5BA]'></div>
            <div className='flex items-center gap-1'><p className='text-[12px]'>Female</p><p className='font-semibold'>{genderDistribution.female.toLocaleString()}</p></div>
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center w-[40rem] bg-white rounded-xl px-16 py-3 mt-[1rem] mx-[4rem]'>
        <div>NUMBER OF REGISTERED VOTERS BY 2024</div>
        <div className="flex mt-4 mb-3 h-5 w-full rounded-full bg-green-200 overflow-hidden">
          <div className="bg-[#B1E5BA] h-full" style={{ width: `${registeredPercentage}%` }}></div>
          <div className="bg-[#007F73] h-full" style={{ width: `${nonRegisteredPercentage}%` }}></div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-[#B1E5BA]'></div>
            <div className='flex items-center gap-1'><p className='text-[12px]'>Registered Voters</p><p className='font-semibold'>{voterDistribution.registered.toLocaleString()}</p></div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-[#007F73]'></div>
            <div className='flex items-center gap-1'><p className='text-[12px]'>Non Voters</p><p className='font-semibold'>{voterDistribution.nonRegistered.toLocaleString()}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
};
