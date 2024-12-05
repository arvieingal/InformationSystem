'use client'
import React, { useState, useEffect } from 'react'
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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize the imagesLoaded array with false values for each card
    setImagesLoaded(new Array(cards.length).fill(false));

    // Preload images
    cards.forEach((card, index) => {
      const img = new Image();
      img.src = card.src;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, [cards]);

  return (
    <div className='flex flex-wrap justify-center pt-[1rem] h-[20%]'>
      {cards.map((card, index) => (
        <Card
          key={card.link}
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
          isLoaded={imagesLoaded[index]}
        />
      ))}
    </div>
  );
};

export default CardGrid;