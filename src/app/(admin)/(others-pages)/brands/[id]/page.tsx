'use server';

import { getBrandById } from '@/actions/brand';
import { getProductByBrandId } from '@/actions/product';
import BrandForm from '@/components/brands/BrandForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { validatePermissions } from '@/core/authentication/roleValidations';
import {
  IBrand,
  IPage,
  IProduct,
  IResponse,
  ISearchParams,
} from '@/core/types';
import { redirect } from 'next/navigation';

export default async function UpdateBrandPage(ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('BRD:LS');
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};
  const awaitedParams = await ctx.params;
  const brandResponse: IResponse<IBrand> = await getBrandById(awaitedParams.id);

  if (!brandResponse.success || !brandResponse.data) {
    console.error(brandResponse.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Brands', href: '/brands' },
    { label: brandResponse.data.name, href: '#' },
  ];

  const brandProducts: IResponse<IPage<IProduct>> = await getProductByBrandId(
    awaitedParams.id,
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  );

  return (
    <>
      <PageBreadcrumb
        pageTitle={brandResponse.data.name}
        items={breadCrumbItems}
      />
      <BrandForm
        brand={brandResponse.data}
        brandProducts={brandProducts?.data}
        searchParams={searchParams}
      />
    </>
  );
}
