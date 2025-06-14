'use server';

import { getProductById } from '@/actions/product';
import { getProductTypeList } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductForm from '@/components/products/ProductForm';
import { IPage, IProduct, IProductType, IResponse } from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;

  const product: IResponse<IProduct> = await getProductById(awaitedParams.id);

  if (!product?.success || !product?.data) {
    return <div>Error fetching product details.</div>;
  }

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product?.data?.name, href: '#' },
  ];

  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();
  return (
    <>
      <PageBreadcrumb
        pageTitle={product?.data?.name || 'Edit Product'}
        items={breadCrumbItems}
      />
      <ProductForm
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        product={product.data}
      />
    </>
  );
}
