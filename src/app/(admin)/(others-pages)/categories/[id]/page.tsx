'use server';

import { getCategoryById } from '@/actions/category';
import CategoryForm from '@/components/categories/CategoryForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { ISearchParams } from '@/core/types';

const CategoryEditPage = async (ctx: {
  params: { id: string };
  searchParams?: Promise<ISearchParams | null>;
}) => {
  // const searchParams: ISearchParams | null = (await ctx.searchParams) || {};
  const awaitedParams = await ctx.params;

  const categoryResponse = await getCategoryById(awaitedParams.id);

  if (!categoryResponse?.success || !categoryResponse?.data) {
    return <div>Error fetching category details.</div>;
  }

  const parentCategoryOption = categoryResponse?.data?.parentId ? {
    label: categoryResponse?.data?.parentName || '',
    value: categoryResponse?.data?.parentId || '',
  } : undefined;

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
      <CategoryForm category={categoryResponse?.data} parentCategoryOption={parentCategoryOption} />
    </>
  );
};

export default CategoryEditPage;
