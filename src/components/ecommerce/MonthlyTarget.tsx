'use client';
// import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';

import dynamic from 'next/dynamic';

import { JSX } from 'react';
import { formatPrice } from '@/utils/stringUtils';
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface MonthlyTargetProps {
  monthlyRevenue?: number;
  draftOrderCount?: number;
  draftOrderRevenue?: number;
}

export default function MonthlyTarget({
  monthlyRevenue = 0,
  draftOrderCount = 0,
  draftOrderRevenue = 0,
}: MonthlyTargetProps): JSX.Element {
  const series = [76];
  const options: ApexOptions = {
    colors: ['#465FFF'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'radialBar',
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: '80%',
        },
        track: {
          background: '#E4E7EC',
          strokeWidth: '100%',
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '36px',
            fontWeight: '600',
            offsetY: -40,
            color: '#1D2939',
            formatter: function (val) {
              return val + '%';
            },
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#465FFF'],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };

  return (
    <div className='rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6'>
        <div className='flex justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
              Monthly Revenue
            </h3>
            <p className='mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400'>
              How much carts become orders in the last month
            </p>
          </div>
          {/* <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div> */}
        </div>
        <div className='relative '>
          <div className='max-h-[330px]'>
            <ReactApexChart
              options={options}
              series={series}
              type='radialBar'
              height={330}
            />
          </div>
        </div>
        <p className='mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base'>
          You earn {formatPrice(monthlyRevenue)} this month till now,{' '}
          {monthlyRevenue > 0 && 'Good work!'}
        </p>
      </div>

      <div className='flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5'>
        <div>
          <p className='mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm'>
            Current Revenue
          </p>
          <p className='flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg'>
            {formatPrice(monthlyRevenue)}
          </p>
        </div>

        <div className='w-px bg-gray-200 h-7 dark:bg-gray-800'></div>

        <div>
          <p className='mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm'>
            Pending Cart Count
          </p>
          <p className='flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg'>
            {draftOrderCount}
          </p>
        </div>

        <div className='w-px bg-gray-200 h-7 dark:bg-gray-800'></div>

        <div>
          <p className='mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm'>
            Draft Order Value
          </p>
          <p className='flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg'>
            {formatPrice(draftOrderRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
