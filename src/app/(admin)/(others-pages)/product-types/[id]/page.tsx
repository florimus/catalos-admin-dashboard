'use server';

import { getProductTypeById } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductTypeForm from '@/components/productTypes/ProductTypeForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IProductType, IResponse } from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Product Type | Catalos Admin',
  };
}

export default async function ProductTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('PTY:LS');
  const awaitedParams = await params;

  const productType: IResponse<IProductType> = await getProductTypeById(
    awaitedParams.id
  );

  if (!productType?.success || !productType?.data) {
    console.error(productType.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Product Types', href: '/product-types' },
    { label: productType?.data?.name, href: '#' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle={productType?.data?.name} items={breadCrumbItems} backUrl='/product-types' />
      <ProductTypeForm productType={productType?.data} />
    </>
  );
}
