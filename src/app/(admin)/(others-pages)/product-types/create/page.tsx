'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductTypeForm from '@/components/productTypes/ProductTypeForm';
import { validatePermissions } from '@/core/authentication/roleValidations';

export async function generateMetadata() {
  return {
    title: 'Create Product Type | Catalos Admin',
  };
}

export default async function CreateProductType() {
  await validatePermissions('PTY:NN');
  const breadCrumbItems = [
    { label: 'Product Types', href: '/product-types' },
    { label: 'Create Product Type', href: '/product-types/create' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle='Create Product Type' items={breadCrumbItems} />
      <ProductTypeForm />
    </>
  );
}
