'use server';

import { getProductTypeList } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CreateProductForm from '@/components/products/CreateProduct';
import { IPage, IProductType, IResponse } from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';

export default async function CreateProduct() {
  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'Create Product', href: '/products/create' },
  ];
  const productTypes: IResponse<IPage<IProductType>> = await getProductTypeList();
  return (
    <>
      <PageBreadcrumb pageTitle='Create Product' items={breadCrumbItems} />
      <CreateProductForm productTypeOptions={productTypesToSingleSelectMapper(productTypes?.data?.hits)} />
    </>
  );
}
