"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Card from '@/components/Card'

const Dashboard = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cards = [
    { src: '/svg/population.svg', alt: 'Card Image 1', description: 'POPULATION', value: '+50% as of 2024', width: 100, height: 100, link: '/population' },
    { src: '/svg/households.svg', alt: 'Card Image 2', description: 'HOUSEHOLDS', value: '+50% as of 2024', width: 200, height: 80, link: '/households' },
    { src: '/svg/renters.svg', alt: 'Card Image 3', description: 'RENTERS', value: '+50% as of 2024', width: 90, height: 110, link: '/renters' },
    { src: '/svg/sector.svg', alt: 'Card Image 4', description: 'SECTOR', value: '+50% as of 2024', width: 150, height: 130, link: '/sector' },
    { src: '/svg/purok.svg', alt: 'Card Image 5', description: 'PUROK', value: '+50% as of 2024', width: 140, height: 140, link: '/purok' },
  ];

  return (
    <div>
      {selectedCard === null && (
        <>
          <div className='w-full h-auto flex items-center justify-center mt-[2rem]'>
            <Image
              src="/svg/dashboard.svg"
              width={300}
              height={500}
              alt="Logo"
              className="w-auto"
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-[#06C46C] font-semibold text-[40px]'>Welcome to Our Community!</p>
            <p className='font-semibold text-[14px]'>Get to know us more, browse our residents profiles</p>
          </div>
        </>
      )}
      <div className='flex flex-wrap justify-center mt-[1rem]'>
        {cards.map((card, index) => (
          <Card
            key={index}
            src={card.src}
            alt={card.alt}
            description={card.description}
            value={card.value}
            width={card.width}
            height={card.height}
            link={card.link}
            onClick={() => setSelectedCard(index)}
            selected={selectedCard === index}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
