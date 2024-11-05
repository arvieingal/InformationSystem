'use client'
import React, { useState } from 'react'
import Card from '@/components/Card'
import { usePathname } from 'next/navigation';

interface CardData {
  src: string;
  alt: string;
  description: string;
  value: string;
  width: number;
  height: number;
  link: string;
}

interface CardGridProps {
  cards: CardData[];
}

const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const pathname = usePathname();

  return (
    <div className='flex flex-wrap justify-center pt-[1rem] h-[22%]'>
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
          selected={selectedCard === index || pathname === card.link}
          textColor={(selectedCard === index || pathname === card.link) ? 'text-white' : 'text-black'}
        />
      ))}
    </div>
  );
};

export default CardGrid;