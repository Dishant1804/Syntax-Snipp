'use client'

import { useLayoutEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { SpinnerWithText } from '../components/ui/spinnerWithText';


const publicRoutes = ['/', '/login', '/signup', '/signin', '/sharesnippet'];

const AuthCheck = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      if (publicRoutes.includes(pathname)) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/check-auth', {
          withCredentials: true,
        });

        if (!response.data.success) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);


  if (loading) {
    return <div className="w-full bg-[#111111] h-full flex justify-center items-center">
      <SpinnerWithText />
    </div>
  }

  return children;
};

export default AuthCheck;