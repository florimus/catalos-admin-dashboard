'use server';

import { getProductTypeById } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductTypeForm from '@/components/productTypes/ProductTypeForm';
import { IProductType, IResponse } from '@/core/types';

export default async function ProductTypePage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;

  const productType: IResponse<IProductType> = await getProductTypeById(
    awaitedParams.id
  );

  if (!productType?.success || !productType?.data) {
    return <div>Error fetching product type details.</div>;
  }

  const breadCrumbItems = [
    { label: 'Product Types', href: '/product-types' },
    { label: productType?.data?.name, href: '/product-types/create' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle={productType?.data?.name} items={breadCrumbItems} />
      <ProductTypeForm productType={productType?.data} />
    </>
  );
}
