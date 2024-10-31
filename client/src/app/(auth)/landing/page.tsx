'use client'
import AdminHeader from '@/components/AdminHeader'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter();

  const handleResidentClick = () => {
    router.push("/dashboard");
  };

  const handleHealthClick = () => {
    //TODO: Change to Health Page folder name
    router.push("/health");
  };

  return (
    <div className='bg-[#E7EEF4] w-full sm:h-full lg:h-screen'>
      <AdminHeader />
      <div className='w-full mt-20 mb-20 md:mt-28 md:mb-28'>
        <p className='text-[#06C46C] text-[24px] md:text-[36px] font-semibold text-center'>Barangay Information Management System</p>
      </div>
      <div className='flex items-center justify-center w-full gap-20 pb-16 mt-16 flex-col md:flex-row'>
        <div>
          <div className='w-[300px] h-[200px] md:w-[534px] md:h-[304px] bg-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer' onClick={handleResidentClick}>
            <Image src="/svg/resident.svg" alt="resident" width={534} height={304} />
          </div>
          <p className='md:text-[20px] text-[16px] text-center mt-12 font-semibold'>Resident Profiling with Analytics</p>
        </div>
        <div>
          <div className='md:w-[534px] md:h-[304px] w-[300px] h-[200px] bg-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer' onClick={handleHealthClick}>
            <Image src="/svg/pre_school.svg" alt="resident" width={534} height={304} />
          </div>
          <p className='md:text-[20px] text-[16px] text-center mt-12 font-semibold'>Health Information and Analytics</p>
        </div>
      </div>
    </div>
  )
}
