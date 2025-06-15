'use server';

import { getProductById } from '@/actions/product';
import { getProductTypeList } from '@/actions/product-type';
import { getVariantsByProductId } from '@/actions/variant';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import ProductForm from '@/components/products/ProductForm';
import VariantList from '@/components/variants/VariantList';
import {
  IPage,
  IProduct,
  IProductType,
  IResponse,
  ISearchParams,
  IVariant,
} from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';

export default async function EditProduct(ctx: {
  params: { id: string };
  searchParams?: Promise<ISearchParams | null>;
}) {
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
    return <div>Error fetching product details.</div>;
  }

  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product?.data?.name, href: '#' },
  ];

  const newVariantCta = {
    label: 'New Variant',
    href: '/variants/create',
  };

  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();
  return (
    <>
      <PageBreadcrumb
        pageTitle={product?.data?.name || 'Edit Product'}
        items={breadCrumbItems}
        backUrl='/products'
      />
      <ProductForm
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        product={product.data}
      />
      <TableCard
        searchPlaceHolder={'Search variants...'}
        searchParams={searchParams}
        cta={newVariantCta}
      >
        <VariantList {...variants?.data} />
      </TableCard>
    </>
  );
}
