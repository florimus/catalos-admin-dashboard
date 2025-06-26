'use server';

import { getTaxes } from '@/actions/tax';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import TaxList from '@/components/settings/tax-categories/TaxList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IPage, IResponse, ISearchParams, ITax } from '@/core/types';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Tax Categories | Catalos Admin',
  };
}

export default async function TaxListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('TAX:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<ITax>> = await getTaxes(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch staffs:', response.message);
    return redirect('/forbidden');
  }

  const cta = {
    permission: 'TAX:NN',
    label: 'New Tax Category',
    href: '/settings/tax-categories/create',
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle='Tax Categories'
        items={[
          { label: 'Settings', href: '/settings' },
          { label: 'Tax Categories', href: '#' },
        ]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search Tax Categories...'}
          searchParams={searchParams}
          cta={cta}
        >
          <TaxList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
