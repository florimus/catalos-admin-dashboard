'use server';

import { getBrandById } from '@/actions/brand';
import BrandForm from '@/components/brands/BrandForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { IBrand, IResponse, ISearchParams } from '@/core/types';

export default async function UpdateBrandPage(ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ISearchParams | null>;
}) {
  const awaitedParams = await ctx.params;
  const brandResponse: IResponse<IBrand> = await getBrandById(awaitedParams.id);

  if (!brandResponse.success || !brandResponse.data) {
    return <div>Error fetching brand details.</div>;
  }
  const breadCrumbItems = [
    { label: 'Brands', href: '/brands' },
    { label: brandResponse.data.name, href: '#' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle={brandResponse.data.name} items={breadCrumbItems} />
      <BrandForm brand={brandResponse.data} />
    </>
  );
}
