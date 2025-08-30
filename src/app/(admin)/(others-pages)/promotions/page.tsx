'use server';

import { getPromotions } from '@/actions/promotions';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import ProductFiltersModal from '@/components/promotions/modal/PromotionFiltersModal';
import PromotionList from '@/components/promotions/PromotionList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import {  IOrderSearchParams, IPage, IPromotion, IResponse } from '@/core/types';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Promotions | Catalos Admin',
  };
}

export default async function DiscountsListPage(ctx: {
  searchParams?: Promise<IOrderSearchParams | null>;
}) {
  await validatePermissions('PRO:LS');
  const searchParams: IOrderSearchParams | null =
    (await ctx.searchParams) || {};

  const response: IResponse<IPage<IPromotion>> = await getPromotions(
    searchParams?.query || 's',
    searchParams?.channel,
    {},
    searchParams?.page,
    searchParams?.size,
  );

  if (!response.success) {
    console.error('Failed to fetch promotions:', response.message);
    redirect('/404');
  }

  return (
    <>
      <PageBreadcrumb
        pageTitle='Promotions'
        items={[{ label: 'Promotions', href: '#' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search promotions...'}
          searchParams={searchParams}
          filters={
            <ProductFiltersModal
              key='promotion-filters'
              searchParams={searchParams}
            />
          }
        >
          <PromotionList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
