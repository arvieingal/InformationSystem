'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CardProps {
  src: string;
  alt: string;
  description: string;
  value: string;
  width: number;
  height: number;
  link: string;
  onClick?: () => void;
  selected: boolean;
  textColor: string;
  isLoaded?: boolean;
}

const Card: React.FC<CardProps> = ({ src, alt, description, value, width, height, link, onClick, selected, isLoaded = false }) => {
  return (
    <Link href={link} className='cursor-default'>
      <button
        className={`relative p-2 rounded-lg shadow-md my-2 mx-5 transition-all duration-300 ${selected ? 'bg-[#007F73] text-white' : 'bg-white'} hover:bg-[#007F73] hover:text-white`}
        onClick={onClick}
      >
        <div className='flex items-center justify-center pt-2'>
          {!isLoaded ? (
            <div className="flex justify-center items-center h-[50px] w-[160px]">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#B1E5BA]"></div>
            </div>
          ) : (
            <Image
              src={src}
              width={100}
              height={100}
              alt={alt}
              className="w-[160px] h-[50px] object-contain"
              priority
            />
          )}
        </div>
        <div className='flex flex-col items-center justify-end'>
          <p className='text-center text-[14px] text-medium'>{description}</p>
          <p className='text-center text-[9px] text-[#06C46C]'>{value}</p>
        </div>
      </button>
    </Link>
  );
};

export default Card;

