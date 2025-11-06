'use client';


import { useState } from 'react';
import { Fighter } from "@/lib/types/fighter";
import SearchDropdown, { OptionType } from '@/components/SearchDropdown';
import { Typography } from '@mui/material';

export default function FighterStats () {
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [allFighters, setAllFighters] = useState<OptionType[]>([]);


    return (
      <Typography variant="h1"> Compare Stats </Typography>
    );




}