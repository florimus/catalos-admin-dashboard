'use server';

import { getOrders } from '@/actions/order';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import OrderList from '@/components/Orders/OrdersList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IMiniOrder, IPage, IResponse, ISearchParams } from '@/core/types';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Orders | Catalos Admin',
  };
}

export default async function OrdersListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('ORD:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<IMiniOrder>> = await getOrders(
    searchParams?.query,
    searchParams?.channel,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch orders:', response.message);
    redirect('/404');
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle='Orders'
        items={[{ label: 'Orders', href: '#' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search orders...'}
          searchParams={searchParams}
        >
          <OrderList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
