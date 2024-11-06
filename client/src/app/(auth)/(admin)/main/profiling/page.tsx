'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import CardGrid from '@/components/CardGrid';
import { dashboardCards } from '@/constants/cardData';

const Profiling = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div>
      {selectedCard === null && (
        <>
          <div className='w-full h-full flex items-center justify-center mt-[5rem]'>
            <Image
              src="/svg/dashboard.svg"
              width={100}
              height={100}
              alt="Logo"
              className="w-[400px] h-[200px]"
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-[#06C46C] font-semibold text-[34px] mt-[3rem]'>Welcome to Our Community!</p>
            <p className='font-semibold text-[14px] mb-[2rem]'>Get to know us more, browse our residents profiles</p>
          </div>
        </>
      )}
      <CardGrid cards={dashboardCards} />
    </div>
  );
};

export default Profiling;