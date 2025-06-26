'use server';

import BrandForm from '@/components/brands/BrandForm';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { validatePermissions } from '@/core/authentication/roleValidations';

export async function generateMetadata() {
  return {
    title: 'Create Brand | Catalos Admin',
  };
}

export default async function CreateBrandPage() {
  await validatePermissions('BRD:NN');
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
