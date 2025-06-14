'use server';

import { getProductById } from '@/actions/product';
import { getProductTypeList } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CreateProductForm from '@/components/products/CreateProduct';
import { IPage, IProduct, IProductType, IResponse } from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'Edit Product', href: '#' },
  ];

  const awaitedParams = await params;

  const product: IResponse<IProduct> = await getProductById(awaitedParams.id);

  if (!product?.success || !product?.data) {
    return <div>Error fetching product details.</div>;
  }

  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();
  return (
    <>
      <PageBreadcrumb pageTitle='Edit Product' items={breadCrumbItems} />
      <CreateProductForm
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        product={product.data}
      />
    </>
  );
}
