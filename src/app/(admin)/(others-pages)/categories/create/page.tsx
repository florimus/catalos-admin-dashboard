'use server';

import CategoryForm from '@/components/categories/CategoryForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const CategoryCreatePage = () => {
  const breadCrumbItems = [
    { label: 'Categories', href: '/categories' },
    { label: 'Create Category', href: '/categories/create' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle='Create Category' items={breadCrumbItems} />
      <CategoryForm />
    </>
  );
};

export default CategoryCreatePage;
