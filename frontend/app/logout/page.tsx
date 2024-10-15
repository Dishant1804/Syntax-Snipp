"use client";
import { SpinnerWithText } from "@/components/ui/spinnerWithText";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const Logout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const logout = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:3000/api/v1/auth/logout' , {} , {
          withCredentials : true,
        });

        if (response.data.success) {
          Cookies.remove('token', { path: '/' });
          Cookies.remove('_gh_sess', { path: '/' });
          Cookies.remove('_octo', { path: '/' });
          Cookies.remove('logged_in', { path: '/' });

          router.push('/');
        } else {
          console.error('Logout failed:', response.data.message);
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setLoading(false);
      }
    };

    logout();
  }, [router]);

  return (
    <>
      {loading && 
        <div className="w-full h-full flex justify-center items-center">
          <SpinnerWithText />
        </div>
      }
    </>
  );
}

export default Logout;