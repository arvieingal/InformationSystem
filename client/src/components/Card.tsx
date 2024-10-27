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
}

const Card: React.FC<CardProps> = ({ src, alt, description, value, width, height, link, onClick, selected }) => {
  return (
    <Link href={link}>
      <div
        onClick={onClick}
        className={`m-4 p-4 border shadow-lg w-[15rem] bg-white rounded-[10px] h-[12rem] cursor-pointer ${selected ? 'mt-0' : ''}`}
      >
        <div className='flex items-center justify-center'>
          <Image
            src={src}
            width={width}
            height={height}
            alt={alt}
            className="w-auto h-auto"
          />
        </div>
        <p className='text-center mt-4'>{description}</p>
        <p className='text-center text-[#06C46C] mt-4'>{value}</p>
      </div>
    </Link>
  );
};

export default Card;
