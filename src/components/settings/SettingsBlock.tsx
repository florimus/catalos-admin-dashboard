'use client';

import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

interface SettingsBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const SettingsBlock: FC<SettingsBlockProps> = ({
  icon,
  title,
  description,
  link,
}) => {
  const router = useRouter();
  const { start } = useGlobalLoader();

  const handleClick = () => {
    start(() => router.push(link));
  };

  return (
    <div
      onClick={handleClick}
      className='flex flex-col justify-center items-center w-auto p-10 py-20 h-28 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'
    >
      <div>{icon}</div>
      <h3 className='text-gray-800 dark:text-gray-200 font-bold mb-1'>
        {title}
      </h3>
      <p className='text-gray-700 dark:text-gray-400 text-sm'>{description}</p>
    </div>
  );
};

export default SettingsBlock;
