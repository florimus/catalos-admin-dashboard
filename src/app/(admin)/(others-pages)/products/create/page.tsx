'use server';

import { getCategories } from '@/actions/category';
import { getProductTypeList } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductForm from '@/components/products/ProductForm';
import { ICategory, IPage, IProductType, IResponse } from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';

export default async function CreateProduct() {
  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'Create Product', href: '/products/create' },
  ];
  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();
  const initialCategories: IResponse<IPage<ICategory>> = await getCategories();
  return (
    <>
      <PageBreadcrumb pageTitle='Create Product' items={breadCrumbItems} />
      <ProductForm
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        initialCategories={initialCategories?.data?.hits || []}
      />
    </>
  );
}
