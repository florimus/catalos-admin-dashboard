'use server';

import { getCategories, getCategoryById } from '@/actions/category';
import { getProductByCategoryId } from '@/actions/product';
import CategoryForm from '@/components/categories/CategoryForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import {
  ICategory,
  IPage,
  IProduct,
  IResponse,
  ISearchParams,
} from '@/core/types';


const CategoryEditPage = async (ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ISearchParams | null>;
}) => {
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};
  const awaitedParams = await ctx.params;

  const categoryResponse = await getCategoryById(awaitedParams.id);

  if (!categoryResponse?.success || !categoryResponse?.data) {
    return <div>Error fetching category details.</div>;
  }

  const associatedCategories: IResponse<IPage<ICategory>> = await getCategories(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size,
    categoryResponse?.data?.id
  );

  if (!associatedCategories?.success || !associatedCategories?.data) {
    return <div>Error fetching category details.</div>;
  }

  const associatedProducts: IResponse<IPage<IProduct>> =
    (await getProductByCategoryId(
      categoryResponse?.data?.id || '',
      searchParams?.query,
      searchParams?.page,
      searchParams?.size
    )) || {};

  const parentCategoryOption = categoryResponse?.data?.parentId
    ? {
        label: categoryResponse?.data?.parentName || '',
        value: categoryResponse?.data?.parentId || '',
      }
    : undefined;

  const initialCategoryList: IResponse<IPage<ICategory>> =
    (await getCategories()) || {};

  const breadCrumbItems = [
    { label: 'Categories', href: '/categories' },
    { label: categoryResponse?.data?.name, href: '#' },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle={categoryResponse?.data?.name}
        items={breadCrumbItems}
      />
      <CategoryForm
        category={categoryResponse?.data}
        parentCategoryOption={parentCategoryOption}
        associatedCategories={associatedCategories?.data}
        initialCategoryList={initialCategoryList?.data?.hits || []}
        associatedProducts={associatedProducts?.data}
      />
    </>
  );
};

export default CategoryEditPage;
