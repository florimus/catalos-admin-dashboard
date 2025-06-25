// import UserAddressCard from "@/components/user-profile/UserAddressCard";
import { fetchUserInfoWithoutCookies } from '@/actions/user';
import UserInfoCard from '@/components/user-profile/UserInfoCard';
import UserMetaCard from '@/components/user-profile/UserMetaCard';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IResponse, IUserInfo } from '@/core/types';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next.js Profile | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default async function Profile() {
  await validatePermissions('USR:LS');
  const response: IResponse<IUserInfo> = await fetchUserInfoWithoutCookies();

  if (!response?.success) {
    // TODO: Logout
  }

  return (
    <div>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6'>
        <h3 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7'>
          Profile
        </h3>
        <div className='space-y-6'>
          <UserMetaCard userInfo={response?.data} />
          <UserInfoCard userInfo={response?.data} />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </div>
  );
}
