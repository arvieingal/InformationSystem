'use client'
import React, { useState } from 'react'
import CardGrid from '@/components/CardGrid';
import { dashboardCards } from '@/constants/cardData';

const Renters = () => {
  return <CardGrid cards={dashboardCards} />;
};

export default Renters;