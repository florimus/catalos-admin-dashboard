'use server';

import { getBrands } from '@/actions/brand';
import { getCategories } from '@/actions/category';
import { getProductTypeList } from '@/actions/product-type';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductForm from '@/components/products/ProductForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IBrand, ICategory, IPage, IProductType, IResponse } from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';

export default async function CreateProduct() {
  await validatePermissions('PRD:NN');
  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'Create Product', href: '/products/create' },
  ];
  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();
  const initialCategories: IResponse<IPage<ICategory>> = await getCategories();
  const initialBrands: IResponse<IPage<IBrand>> = await getBrands();
  return (
    <>
      <PageBreadcrumb pageTitle='Create Product' items={breadCrumbItems} />
      <ProductForm
        permission='PRD:NN'
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        initialCategories={initialCategories?.data?.hits || []}
        initialBrands={initialBrands?.data?.hits || []}
      />
    </>
  );
}
