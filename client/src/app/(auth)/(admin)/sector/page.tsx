'use client'
import React, { useState } from 'react'
import CardGrid from '@/components/CardGrid';
import { dashboardCards } from '@/constants/cardData';

const Sector = () => {
  return <CardGrid cards={dashboardCards} />;
};

export default Sector;