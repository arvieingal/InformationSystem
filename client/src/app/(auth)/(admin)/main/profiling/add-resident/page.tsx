import React from 'react'
import Image from 'next/image'

export default function page() {
  return (
    <div>
      <div className="w-full h-full pt-[5rem]">
        <div className="flex items-center justify-center">
          <Image
            src="/svg/dashboard.svg"
            width={100}
            height={100}
            alt="Logo"
            className="w-[400px] h-[200px]"
          />
        </div>
        <div className="flex flex-col items-center justify-center pt-[3rem]">
          <p className="text-[#06C46C] font-semibold text-[28px]">
            Join Our Community!
          </p>
          <p className="font-semibold text-[11px] pb-[2rem]">
            Get started choose below to add a new User or Resident
          </p>
        </div>
        <div className='flex justify-center items-center gap-32'>
          <div className='h-[160px] w-[190px] bg-white flex flex-col items-center justify-center rounded-[10px]'>
            <Image src={'/svg/add-logo.svg'} alt='Add User' height={100} width={100} className='h-[70%] w-full'/>
            <div className='text-[#338A80] font-semibold'>Add User</div>
          </div>
          <div className='h-[160px] w-[190px] bg-white flex flex-col items-center justify-center rounded-[10px]'>
            <Image src={'/svg/add-logo.svg'} alt='Add User' height={100} width={100} className='h-[70%] w-full' />
            <div className='text-[#338A80] font-semibold'>Add Resident</div>
          </div>
          <div className='h-[160px] w-[190px] bg-white flex flex-col items-center justify-center rounded-[10px]'>
            <Image src={'/svg/add-logo.svg'} alt='Add User' height={100} width={100} className='h-[70%] w-full' />
            <div className='text-[#338A80] font-semibold'>Add Renter</div>
          </div>
        </div>
      </div>
    </div>
  )
}
