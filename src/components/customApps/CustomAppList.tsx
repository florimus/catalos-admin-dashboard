'use client';
/* eslint-disable @next/next/no-img-element */

import { ICustomApp } from '@/core/types';
import Button from '../ui/button/Button';
import { GitHubIcon } from '@/icons';
import Link from 'next/link';

interface CustomAppListProps {
  installedApps: ICustomApp[];
  isInstalled?: boolean;
}

const CustomAppList: React.FC<CustomAppListProps> = ({ installedApps }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {installedApps.map((app, index) => (
        <div
          key={index}
          className='flex flex-col justify-center items-center w-auto p-10 py-40 h-28 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 relative'
        >
          {app.logo && (
            <img
              width={32}
              height={32}
              src={app.logo}
              alt={app.name}
              className='my-2'
            />
          )}
          <h3 className='text-gray-800 dark:text-gray-200 font-bold mb-1'>
            {app.name}
          </h3>
          {app.description && (
            <p className='text-gray-700 dark:text-gray-400 text-sm my-5'>
              {app.description}
            </p>
          )}
          <div className='absolute bottom-2 right-2 flex w-full justify-end content-end'>
            <Link target='_blank'  href={app.githubUrl}>
              <Button size='xm' variant='outline' className='ml-4'>
                <GitHubIcon />
                Github
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomAppList;
