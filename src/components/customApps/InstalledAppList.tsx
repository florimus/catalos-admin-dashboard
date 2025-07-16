'use client';
/* eslint-disable @next/next/no-img-element */

import { ICustomApp } from '@/core/types';
import Button from '../ui/button/Button';
import { TrashBinIcon } from '@/icons';

interface InstalledAppListProps {
  installedApps: ICustomApp[];
}

const CustomAppList: React.FC<InstalledAppListProps> = ({ installedApps }) => {
  return (
    <div className='flex flex-col gap-4'>
      {installedApps.map((app, index) => (
        <div
          key={index}
          className='flex items-start justify-between p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
        >
          <div className='flex-shrink-0'>
            {app.logo && (
              <img
                width={48}
                height={48}
                src={app.logo}
                alt={app.name}
                className='rounded-md'
              />
            )}
          </div>

          <div className='flex flex-col justify-center ml-4 flex-grow'>
            <h3 className='text-gray-800 dark:text-gray-200 font-semibold text-base'>
              {app.name}
            </h3>
            {app.description && (
              <p className='text-gray-600 dark:text-gray-400 text-sm mt-1'>
                {app.description}
              </p>
            )}
          </div>

          <div className='flex items-center ml-4 mt-2'>
            <Button variant='danger' size='xm'>
              <TrashBinIcon />
              Uninstall
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomAppList;
