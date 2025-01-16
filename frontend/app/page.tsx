"use client"

import LandingPage from '@/components/landing/page';
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