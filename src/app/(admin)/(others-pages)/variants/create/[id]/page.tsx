'use server';

import { getProductById } from '@/actions/product';
import { getProductTypeById } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import VariantForm from '@/components/variants/VariantForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IProduct, IProductType, IResponse } from '@/core/types';

export async function generateMetadata() {
  return {
    title: 'Create Variant | Catalos Admin',
  };
}

export default async function CreateVariant(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('VAR:NN');
  const awaitedParam = await ctx.params;

  const productResponse: IResponse<IProduct> = await getProductById(
    awaitedParam.id
  );

  if (!productResponse.success || !productResponse.data) {
    return <div>Error fetching product details.</div>;
  }

  const product: IProduct = productResponse.data;

  const productTypeResponse: IResponse<IProductType> = await getProductTypeById(
    product.productTypeId
  );

  if (!productTypeResponse.success || !productTypeResponse.data) {
    return <div>Error fetching product type details.</div>;
  }

  const productType: IProductType = productTypeResponse.data;

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product.name, href: `/products/${product.id}` },
    { label: 'Create Variant', href: '#' },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Create Variant - ${product.name}`}
        items={breadCrumbItems}
      />
      <VariantForm product={product} productType={productType} />
    </>
  );
}
