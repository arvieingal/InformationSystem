import React from 'react'
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
}

const Card: React.FC<CardProps> = ({ src, alt, description, value, width, height, link, onClick, selected }) => {
  return (
    <Link href={link}>
      <div
        className={`relative p-2 rounded-lg shadow-md cursor-pointer my-2 mx-5 transition-all duration-300 ${selected ? 'bg-[#007F73] text-white' : 'bg-white'
          }`}
        onClick={onClick}
      >
        <div className='flex items-center justify-center pt-2'>
          <Image
            src={src}
            width={100}
            height={100}
            alt={alt}
            className="w-[160px] h-[50px] object-contain"
          />
        </div>
        <div className='flex flex-col items-center justify-end'>
          <p className='text-center text-[14px] text-medium'>{description}</p>
          <p className='text-center text-[9px] text-[#06C46C]'>{value}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
