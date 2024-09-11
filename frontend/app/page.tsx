"use client"

import { useEffect, useState } from 'react';
import LandingPage from '@/components/landing/page';
import Dashboard from '@/components/dashboard/page';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const status = localStorage.getItem('status');
    
    setLoggedIn(!!token && status === 'signin');
  }, []);

  return (
    <>
      {loggedIn ? <Dashboard /> : <LandingPage />}
    </>
  );
}