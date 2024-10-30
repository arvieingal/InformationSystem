'use client'
import React from 'react';
import Image from 'next/image';

interface CardProps {
    path: string;
    imageSrc: string;
    altText: string;
    title: string;
    onClick: (path: string) => void;
}

const HealthCard: React.FC<CardProps> = ({ path, imageSrc, altText, title, onClick }) => {
    return (
        <div onClick={() => onClick(path)} className="cursor-pointer"> 
            <div className="border border-gray-300 bg-white p-4 w-full sm:w-[24rem] h-40 rounded-lg flex flex-row gap-8">
                <Image
                    src={imageSrc}
                    alt={altText}
                    width={120}
                    height={200} 
                    className='sm:hidden md:hidden'/>
                <p className='flex items-center justify-center text-2xl font-bold'>{title}</p>
            </div>
        </div>
    );
};

export default HealthCard;