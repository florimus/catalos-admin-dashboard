'use server';

import { getAPIKeys } from '@/actions/apiKey';
import ApiKeyKList from '@/components/api-keys/ApiKeyList';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import CreateCartModal from '@/components/Orders/modal/CreateCartModal';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IAPIKey, IPage, IResponse, ISearchParams } from '@/core/types';
import { redirect } from 'next/navigation';
import React from 'react';

export async function generateMetadata() {
  return {
    title: 'Carts | Catalos API Keys',
  };
}

export default async function ApiKeyListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('API:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<IAPIKey>> = await getAPIKeys(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch api keys:', response.message);
    redirect('/404');
  }

  const cta = {
    custom: <CreateCartModal />,
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle='API Keys'
        items={[{ label: 'API Keys', href: '#' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search API Keys...'}
          searchParams={searchParams}
          cta={cta}
        >
          <ApiKeyKList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
