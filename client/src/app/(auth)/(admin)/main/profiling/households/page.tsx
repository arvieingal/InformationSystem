'use client'
import React, { useState, useEffect } from 'react'
import CardGrid from '@/components/CardGrid';
import { dashboardCards } from '@/constants/cardData';

const Households = () => {
  return <CardGrid cards={dashboardCards} />;
};

export default Households;
