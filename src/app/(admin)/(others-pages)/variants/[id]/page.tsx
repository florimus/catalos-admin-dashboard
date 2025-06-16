'use server';

import { getProductById } from '@/actions/product';
import { getProductTypeById } from '@/actions/product-type';
import { getVariantById } from '@/actions/variant';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import VariantForm from '@/components/variants/VariantForm';
import { IProduct, IProductType, IResponse, IVariant } from '@/core/types';

export default async function EditVariant(ctx: { params: { id: string } }) {
  const awaitedParam = await ctx.params;

  const variantResponse: IResponse<IVariant> = await getVariantById(
    awaitedParam.id
  );

  if (!variantResponse.success || !variantResponse.data) {
    return <div>Error fetching variant details.</div>;
  }

  const variant: IVariant = variantResponse.data;

  const productResponse: IResponse<IProduct> = await getProductById(
    variant.productId!
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
      <VariantForm
        product={product}
        productType={productType}
        variant={variant}
      />
    </>
  );
}
