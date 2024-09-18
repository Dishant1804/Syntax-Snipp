import { Spinner } from '@/components/ui/spinner';

export const SpinnerWithText = () => {
  return (
    <div className="flex items-center text-white/90 justify-center h-screen">
      <Spinner className="text-white/90" >Loading...</Spinner>
    </div>
  );
};
  