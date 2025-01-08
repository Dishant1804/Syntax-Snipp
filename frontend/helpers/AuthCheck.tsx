'use client'

import { useLayoutEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { SpinnerWithText } from '../components/ui/spinnerWithText';


const publicRoutes = ['/', '/login', '/signup', '/signin', '/sharesnippet' , '/docs' , '/signin/vscode' , '/google/vscode/callback' , '/http://localhost:54321/auth/'];

const AuthCheck = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useLayoutEffect(() => {
    const checkAuth = async () => {
      if (publicRoutes.includes(pathname)) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/check-session', {
          withCredentials: true,
        });

        if (!response.data.valid) {
          toast({
            title: "Session Expired",
            description: "Please login again!",
            duration : 5000,
          });
          router.push('/');
        }
      } 
      catch (error) {
        toast({
          title: "Something went wrong",
          description: "Please login again!",
          duration : 5000
        });
        router.push('/');
      } 
      finally {
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