'use server';

import { getBrands } from '@/actions/brand';
import BrandList from '@/components/brands/BrandList';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IBrand, IPage, IResponse, ISearchParams } from '@/core/types';

export async function generateMetadata() {
  return {
    title: 'Brands | Catalos Admin',
  };
}

export default async function BrandListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('BRD:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<IBrand>> = await getBrands(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  if (!response.success) {
    console.error('Failed to fetch brands:', response.message);
    return <div>Error fetching brands: {response.message}</div>;
  }

  const cta = {
    permission: 'BRD:NN',
    label: 'New Brand',
    href: '/brands/create',
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle='Brands'
        items={[{ label: 'Brands', href: '/brands' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search brands...'}
          searchParams={searchParams}
          cta={cta}
        >
          <BrandList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
