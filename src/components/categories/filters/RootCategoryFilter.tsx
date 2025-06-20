'use client';

import Switch from '@/components/form/switch/Switch';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const RootCategoryFilter: FC = () => {
  const router = useRouter();
  const { start } = useGlobalLoader();
  

  const handleSwitchChange = (checked: boolean) => {
    const url = new URL(window.location.href);
    if (checked) {
      url.searchParams.set('parent', 'root');
    } else {
      url.searchParams.delete('parent');
    }
    start(() => router.push(url.toString()));
  };

  return (
    <Switch
      label='Only Roots'
      defaultChecked={false}
      onChange={handleSwitchChange}
    />
  );
};

export default RootCategoryFilter;
