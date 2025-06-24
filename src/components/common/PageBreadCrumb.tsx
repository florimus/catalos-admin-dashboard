'use client';

import Link from 'next/link';
import React from 'react';
import Button from '../ui/button/Button';
import { ChevronLeftIcon } from '@/icons';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface IBreadcrumbItem {
  label: string;
  href: string;
}

interface IBreadcrumbProps {
  pageTitle: string | React.ReactNode;
  backUrl?: string;
  items?: IBreadcrumbItem[];
}

const PageBreadcrumb: React.FC<IBreadcrumbProps> = ({
  pageTitle,
  items,
  backUrl,
}) => {
  const router = useRouter();
  const { start } = useGlobalLoader();
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
      <h2
        className='text-xl font-semibold text-gray-800 dark:text-white/90 flex justify-center'
        x-text='pageName'
      >
        <Button
          type='button'
          size='xm'
          variant='outline'
          onClick={() =>
            backUrl
              ? start(() => router.push(backUrl))
              : start(() => router.back())
          }
        >
          <ChevronLeftIcon />
        </Button>
        <span className='mx-5 mt-1'>{pageTitle}</span>
      </h2>
      <nav>
        <ol className='flex items-center gap-1.5'>
          <li>
            <Link
              className='inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400'
              href='/'
            >
              Home
              <svg
                className='stroke-current'
                width='17'
                height='16'
                viewBox='0 0 17 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6.0765 12.667L10.2432 8.50033L6.0765 4.33366'
                  stroke=''
                  strokeWidth='1.2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </Link>
          </li>
          {Array.isArray(items) &&
            items.map((item, index) => (
              <li
                key={item.label}
                className={
                  index < items.length - 1
                    ? 'text-sm text-gray-500 dark:text-gray-400'
                    : 'text-sm text-gray-800 dark:text-white/90 cursor-pointer'
                }
              >
                <Link
                  className='inline-flex items-center gap-1.5'
                  href={item.href}
                >
                  {item.label}
                  {index < items.length - 1 && (
                    <svg
                      className='stroke-current'
                      width='17'
                      height='16'
                      viewBox='0 0 17 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M6.0765 12.667L10.2432 8.50033L6.0765 4.33366'
                        stroke=''
                        strokeWidth='1.2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </Link>
              </li>
            ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
