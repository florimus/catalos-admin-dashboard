'use server';

import { getBrands } from '@/actions/brand';
import { getCategories } from '@/actions/category';
import { getProductById } from '@/actions/product';
import { getProductTypeList } from '@/actions/product-type';
import { getVariantsByProductId } from '@/actions/variant';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import ProductForm from '@/components/products/ProductForm';
import VariantList from '@/components/variants/VariantList';
import { validatePermissions } from '@/core/authentication/roleValidations';
import SecureComponent from '@/core/authentication/SecureComponent';
import {
  IBrand,
  ICategory,
  IPage,
  IProduct,
  IProductType,
  IResponse,
  ISearchParams,
  IVariant,
} from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Product | Catalos Admin',
  };
}

export default async function EditProduct(ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('PRD:LS');
  const awaitedParams = await ctx.params;
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};
  const product: IResponse<IProduct> = await getProductById(awaitedParams.id);
  const variants: IResponse<IPage<IVariant>> = (await getVariantsByProductId(
    awaitedParams.id,
    searchParams?.query,
    searchParams?.page,
    searchParams?.size
  )) || { data: [] };

  if (!product?.success || !product?.data) {
    console.error(product.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product?.data?.name, href: '#' },
  ];

  const newVariantCta = {
    permission: 'VAR:NN',
    label: 'New Variant',
    href: `/variants/create/${awaitedParams.id}`,
  };

  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();

  const initialCategories: IResponse<IPage<ICategory>> = await getCategories();
  const initialBrands: IResponse<IPage<IBrand>> = await getBrands();

  return (
    <>
      <PageBreadcrumb
        pageTitle={product?.data?.name || 'Edit Product'}
        items={breadCrumbItems}
        backUrl='/products'
      />
      <ProductForm
        permission='PRD:NN'
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        product={product.data}
        initialCategories={initialCategories?.data?.hits || []}
        initialBrands={initialBrands?.data?.hits || []}
      />
      <SecureComponent permission='VAR:LS'>
        <TableCard
          searchPlaceHolder={'Search variants...'}
          searchParams={searchParams}
          cta={newVariantCta}
        >
          <VariantList {...variants?.data} />
        </TableCard>
      </SecureComponent>
    </>
  );
}
