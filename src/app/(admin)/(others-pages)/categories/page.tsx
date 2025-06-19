'use server';

import { getCategories } from '@/actions/category';
import CategoriesList from '@/components/categories/CategoriesList';
import RootCategoryFilter from '@/components/categories/filters/RootCategoryFilter';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableCard from '@/components/common/TableCard';
import { ICategory, IPage, IResponse, ISearchParams } from '@/core/types';

export default async function CategoriesListPage(ctx: {
  searchParams?: Promise<ISearchParams | null>;
}) {
  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const response: IResponse<IPage<ICategory>> = await getCategories(
    searchParams?.query,
    searchParams?.page,
    searchParams?.size,
    searchParams?.parent
  );

  if (!response.success) {
    console.error('Failed to fetch categories:', response.message);
    return <div>Error fetching categories: {response.message}</div>;
  }

  const cta = {
    label: 'New Category',
    href: '/categories/create',
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle='Categories'
        items={[{ label: 'Categories', href: '/categories' }]}
      />
      <div className='space-y-6'>
        <TableCard
          searchPlaceHolder={'Search categories...'}
          searchParams={searchParams}
          cta={cta}
          filters={<RootCategoryFilter />}
        >
          <CategoriesList {...response.data} />
        </TableCard>
      </div>
    </>
  );
}
