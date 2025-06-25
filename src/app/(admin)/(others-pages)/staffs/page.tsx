'use server';

import { getUsers } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import UserList from '@/components/users/userList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IPage, IResponse, ISearchParams, IUserInfo } from '@/core/types';
import React from 'react';

export default async function CustomersListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('USR:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<IUserInfo>> = await getUsers(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size,
    'staffs'
  );

  if (!response.success) {
    console.error('Failed to fetch staffs:', response.message);
    return <div>Error fetching staffs: {response.message}</div>;
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle='Staffs'
        items={[{ label: 'Staffs', href: '#' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search staffs...'}
          searchParams={searchParams}
        >
          <UserList origin='/staffs' {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
