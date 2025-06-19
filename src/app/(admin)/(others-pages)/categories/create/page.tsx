'use server';

import { getCategories } from '@/actions/category';
import CategoryForm from '@/components/categories/CategoryForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { ICategory, IPage, IResponse } from '@/core/types';

const CategoryCreatePage = async() => {
  const breadCrumbItems = [
    { label: 'Categories', href: '/categories' },
    { label: 'Create Category', href: '/categories/create' },
  ];

  const initialCategoryList: IResponse<IPage<ICategory>> = await getCategories() || {};

  return (
    <>
      <PageBreadcrumb pageTitle='Create Category' items={breadCrumbItems} />
      <CategoryForm initialCategoryList={initialCategoryList?.data?.hits || []} />
    </>
  );
};

export default CategoryCreatePage;
