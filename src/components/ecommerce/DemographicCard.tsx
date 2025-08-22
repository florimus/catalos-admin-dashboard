'use client';
import Image from 'next/image';

import CountryMap from './CountryMap';
import { Fragment } from 'react';
import { CHANNELS } from '@/core/constants';

interface DemographicCardProps {
  channelSalesReport?: Record<string, number>;
  initialOrdersCount?: number;
  newOrdersCount?: number;
}

export default function DemographicCard({
  channelSalesReport,
  initialOrdersCount = 0,
  newOrdersCount = 0,
}: DemographicCardProps) {
  const channelIds = Object.keys(channelSalesReport || {});

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6'>
      <div className='flex justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            Orders Demographic
          </h3>
          <p className='mt-1 text-gray-500 text-theme-sm dark:text-gray-400'>
            Number of Orders based on Countries
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
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div> */}
      </div>
      <div className='px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6'>
        <div
          id='mapOne'
          className='mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]'
        >
          <CountryMap />
        </div>
      </div>

      <div className='space-y-5'>
        {channelIds?.length > 0 &&
          channelIds.map((channelId) => {
            const channel = CHANNELS.find((c) => c.id === channelId);
            if (!channel) return null;
            return (
              <Fragment key={channelId}>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='items-center w-full rounded-full max-w-8'>
                      <Image
                        width={48}
                        height={48}
                        src='/images/country/country-09.webp'
                        alt='usa'
                        className='w-full'
                      />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-800 text-theme-sm dark:text-white/90'>
                        {channel.country || channel.name}
                      </p>
                      <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
                        {initialOrdersCount + newOrdersCount} Orders
                      </span>
                    </div>
                  </div>

                  <div className='flex w-full max-w-[140px] items-center gap-3'>
                    <div className='relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800'>
                      <div
                        className={`absolute left-0 top-0 flex h-full ${
                          channelSalesReport?.[channelId]
                            ? `w-[${channelSalesReport?.[channelId]}%]`
                            : ''
                        } items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white`}
                      ></div>
                    </div>
                    <p className='font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                      {channelSalesReport?.[channelId] || 0}%
                    </p>
                  </div>
                </div>
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}
