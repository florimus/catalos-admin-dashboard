'use server';

import { getOrders } from '@/actions/order';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import CreateCartModal from '@/app/(admin)/(others-pages)/carts/CreateCartModal';
import OrderList from '@/components/Orders/OrdersList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IMiniOrder, IPage, IResponse, ISearchParams } from '@/core/types';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Carts | Catalos Admin',
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
    console.error('Failed to fetch carts:', response.message);
    redirect('/404');
  }

  const cta = {
    custom: <CreateCartModal />,
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle='Carts'
        items={[{ label: 'Carts', href: '/' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search carts...'}
          searchParams={searchParams}
          cta={cta}
        >
          <OrderList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
