'use server';

import { getBrands, listBrandByIds } from '@/actions/brand';
import { getCategories, listCategoriesByIds } from '@/actions/category';
import { getProductTypeList } from '@/actions/product-type';
import { getPromotionById, getPromotionProducts } from '@/actions/promotions';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PromotionForm from '@/components/promotions/PromotionForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import {
  IBrand,
  ICategory,
  IPage,
  IProductType,
  IPromotion,
  IPromotionSearchProduct,
  IResponse,
  ISearchParams,
} from '@/core/types';
import { productTypesToSingleSelectMapper } from '@/utils/mapperUtils';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Promotion | Catalos Admin',
  };
}

export default async function EditPromotion(ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ISearchParams | null>;
}) {
  await validatePermissions('PRO:LS');
  const awaitedParams = await ctx.params;
  // const searchParams: ISearchParams | null = (await ctx.searchParams) || {};
  const promotion: IResponse<IPromotion> = await getPromotionById(
    awaitedParams.id
  );

  if (!promotion?.success || !promotion?.data) {
    console.error(promotion.message);
    redirect('/404');
  }

  const breadCrumbItems = [
    { label: 'Promotions', href: '/promotions' },
    { label: promotion?.data?.name, href: '#' },
  ];

  const promotionProductsPromise: Promise<
    IResponse<IPromotionSearchProduct[]>
  > = getPromotionProducts(
    promotion.data?.targetedProductIds || [],
    promotion.data?.targetedVariantIds || [],
    promotion.data?.availableChannel
  );

  const promotionCategoriesPromise: Promise<IResponse<ICategory[]>> =
    listCategoriesByIds(promotion.data?.targetedCategories || []);

  const promotionBrandsPromise: Promise<IResponse<IBrand[]>> = listBrandByIds(
    promotion.data?.targetedBrands || []
  );

  const [promotionProducts, promotionCategories, promotionBrands] = await Promise.all([
    promotionProductsPromise,
    promotionCategoriesPromise,
    promotionBrandsPromise,
  ]);

  const productTypes: IResponse<IPage<IProductType>> =
    await getProductTypeList();

  const initialCategories: IResponse<IPage<ICategory>> = await getCategories();
  const initialBrands: IResponse<IPage<IBrand>> = await getBrands();

  return (
    <>
      <PageBreadcrumb
        pageTitle={promotion?.data?.name || 'Edit Promotion'}
        items={breadCrumbItems}
        backUrl='/promotions'
      />
      <PromotionForm
        permission='PRO:NN'
        productTypeOptions={productTypesToSingleSelectMapper(
          productTypes?.data?.hits
        )}
        promotionProducts={promotionProducts?.data}
        promotionCategories={promotionCategories?.data}
        promotionBrands={promotionBrands?.data}
        promotion={promotion.data}
        initialCategories={initialCategories?.data?.hits || []}
        initialBrands={initialBrands?.data?.hits || []}
      />
    </>
  );
}
