'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { IUserInfo } from '@/core/types';

interface UserMetaCardProps {
  userInfo?: IUserInfo;
}

const UserMetaCard: FC<UserMetaCardProps> = ({ userInfo }) => {
  return (
    <>
      <div className='p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
          <div className='flex flex-col items-center w-full gap-6 xl:flex-row'>
            <span className='mr-3 overflow-hidden rounded-full h-20 w-20 relative border-gray-200 dark:border-gray-800'>
              <Image
                src={userInfo?.avatar || '/images/user/owner.jpeg'}
                alt='User'
                fill
                className='object-cover'
              />
            </span>
            <div className='order-3 xl:order-2'>
              <h4 className='mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left'>
                {userInfo?.firstName} {userInfo?.lastName}
              </h4>
              <div className='flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {userInfo?.roleId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMetaCard;
