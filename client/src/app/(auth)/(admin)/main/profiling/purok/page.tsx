'use client'
import React from 'react'
import CardGrid from '@/components/CardGrid'
import { dashboardCards } from '@/constants/cardData'

const Purok = () => {
  return <CardGrid cards={dashboardCards} />;
};

export default Purok;