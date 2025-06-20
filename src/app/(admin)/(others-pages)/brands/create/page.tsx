'use server';

import BrandForm from '@/components/brands/BrandForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default async function CreateBrandPage() {
  const breadCrumbItems = [
    { label: 'Brands', href: '/brands' },
    { label: 'Create Brand', href: '#' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle='Create Brand' items={breadCrumbItems} />
      <BrandForm />
    </>
  );
}
