'use client';
import React from 'react';
import Badge from '../ui/badge/Badge';
import {
  BoxIconLine,
  GroupIcon,
  PlusIcon,
} from '@/icons';

interface EcommerceMetricsProps {
  initialCustomersCount?: number;
  newCustomersCount?: number;
  initialOrdersCount?: number;
  newOrdersCount?: number;
}

export const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({
  initialCustomersCount = 0,
  newCustomersCount = 0,
  initialOrdersCount = 0,
  newOrdersCount = 0,
}) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6'>
        <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800'>
          <GroupIcon className='text-gray-800 size-6 dark:text-white/90' />
        </div>

        <div className='flex items-end justify-between mt-5'>
          <div>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Customers
            </span>
            <h4 className='mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90'>
              {initialCustomersCount}
            </h4>
          </div>
          {newCustomersCount > 0 && <Badge color='success'>
            <PlusIcon className='text-success-500' />
            {newCustomersCount} New Today
          </Badge>}
        </div>
      </div>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6'>
        <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800'>
          <BoxIconLine className='text-gray-800 dark:text-white/90' />
        </div>
        <div className='flex items-end justify-between mt-5'>
          <div>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Orders
            </span>
            <h4 className='mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90'>
              {initialOrdersCount}
            </h4>
          </div>

          { newOrdersCount > 0 && <Badge color='success'>
            <PlusIcon className='text-success-500' />
            {newOrdersCount} New Today
          </Badge>}
        </div>
      </div>
    </div>
  );
};
