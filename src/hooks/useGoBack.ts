import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { useRouter } from 'next/navigation';

const useGoBack = () => {
  const router = useRouter();
  const { start } = useGlobalLoader();

  const goBack = () => {
    if (window.history.length > 1) {
      start(() => router.back()); // Use the start function to update the loader // Navigate to the previous route
    } else {
      start(() => router.push('/')); // Redirect to home if no history exists
    }
  };

  return goBack;
};

export default useGoBack;
