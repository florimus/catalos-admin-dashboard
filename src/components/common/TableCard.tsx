'use client';

import React from 'react';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

interface TableCardProps {
  searchPlaceHolder: string;
  children: React.ReactNode;
  desc?: string;
}

const TableCard: React.FC<TableCardProps> = ({
  searchPlaceHolder,
  children,
  desc = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
    >
      {/* Card Header */}
      <div className='px-6 py-5'>
        <form
          className='grid grid-cols-1 sm:grid-cols-2 items-center gap-4'
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type='text'
            name='search'
            id='search'
            placeholder={searchPlaceHolder}
          />
          <div className='flex items-center justify-between gap-2'>
            <Button size='sm' type='submit' variant='outline'>
              Search
            </Button>

            <Button size='sm' type='button' className='ml-2'>
              Create New Channel
            </Button>
          </div>
        </form>
        {desc && (
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {desc}
          </p>
        )}
      </div>

      <div className='p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6'>
        <div className='space-y-6'>{children}</div>
      </div>
    </div>
  );
};

export default TableCard;
