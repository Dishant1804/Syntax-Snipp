import { Spinner } from '@/components/ui/spinner';

const SpinnerWithText = () => {
  return (
    <div className="flex items-center">
      <Spinner>Loading...</Spinner>
    </div>
  );
};

export default SpinnerWithText;
