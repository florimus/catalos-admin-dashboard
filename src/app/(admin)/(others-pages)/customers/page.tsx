'use server';

import { getUsers } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import UserList from '@/components/users/userList';
import { IPage, IResponse, ISearchParams, IUserInfo } from '@/core/types';
import React from 'react';

export default async function CustomersListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<IUserInfo>> = await getUsers(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch products:', response.message);
    return <div>Error fetching products: {response.message}</div>;
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle='Customers'
        items={[{ label: 'Customers', href: '#' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search customers...'}
          searchParams={searchParams}
        >
          <UserList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
