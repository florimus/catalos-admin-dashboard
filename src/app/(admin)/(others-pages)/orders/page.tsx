'use server';

import { getOrders } from '@/actions/order';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import OrderFiltersModal from '@/components/Orders/modal/OrderFiltersModal';
import OrderList from '@/components/Orders/OrdersList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IMiniOrder, IOrderSearchParams, IPage, IResponse } from '@/core/types';
import { getSelectedStatuses } from '@/utils/urlMapper';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Orders | Catalos Admin',
  };
}

export default async function OrdersListPage(ctx: {
  searchParams?: Promise<IOrderSearchParams | null>;
}) {
  await validatePermissions('ORD:LS');
  const searchParams: IOrderSearchParams | null =
    (await ctx.searchParams) || {};

  const response: IResponse<IPage<IMiniOrder>> = await getOrders(
    searchParams?.query,
    searchParams?.channel,
    searchParams?.page,
    searchParams?.size,
    {
      statuses: getSelectedStatuses(
        searchParams?.statuses as unknown as string
      ),
      fromDate: searchParams?.fromDate,
      toDate: searchParams?.toDate,
      excludeStatuses: Boolean(
        (searchParams?.excludeStatuses as unknown as string) === 'true'
      ),
    }
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
          filters={
            <OrderFiltersModal
              key='order-filters'
              searchParams={searchParams}
            />
          }
        >
          <OrderList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
