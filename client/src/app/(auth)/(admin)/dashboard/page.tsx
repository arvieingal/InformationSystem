"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import CardGrid from '@/components/CardGrid';
import { dashboardCards } from '@/constants/cardData';

const Dashboard = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div>
      {selectedCard === null && (
        <>
          <div className='w-full h-auto flex items-center justify-center mt-[5rem]'>
            <Image
              src="/svg/dashboard.svg"
              width={300}
              height={500}
              alt="Logo"
              className="w-auto"
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-[#06C46C] font-semibold text-[40px] mt-[3rem]'>Welcome to Our Community!</p>
            <p className='font-semibold text-[14px] mb-[2rem]'>Get to know us more, browse our residents profiles</p>
          </div>
        </>
      )}
      <CardGrid cards={dashboardCards} />
    </div>
  );
};

export default Dashboard;
