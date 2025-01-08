"use client"

import { useEffect, useState } from 'react';
import LandingPage from '@/components/landing/page';
import Dashboard from '@/components/dashboard/page';
import SmoothScrolling from './SmoothScrolling';

export default function Home() {

  return (
    <>
      <SmoothScrolling>
        <LandingPage />
      </SmoothScrolling>
    </>
  );
}