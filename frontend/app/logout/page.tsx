"use client";
import { SpinnerWithText } from "@/components/ui/spinnerWithText";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';

const Logout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const logout = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {}, {
          withCredentials: true,
        });

        if (response.data.success) {
          Cookies.remove('token', { path: '/' });
          Cookies.remove('_gh_sess', { path: '/' });
          Cookies.remove('_octo', { path: '/' });
          Cookies.remove('logged_in', { path: '/' });

          router.push('/');
        } else {
          if(process.env.NODE_ENV !== 'production'){
            console.error('Logout failed:', response.data.message);
          }
          toast({
            title: "Logout Failed",
            description: "Failed to log out.",
            variant: "destructive",
            duration: 3000
          });
        }
      } catch (error) {
        if(process.env.NODE_ENV !== 'production'){
          console.error('Logout error:', error);
        }
        toast({
          title: "something went wrong",
          variant: "destructive",
          duration: 3000
        });

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
