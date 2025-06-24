'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductTypeForm from '@/components/productTypes/ProductTypeForm';
import { validatePagePermissions } from '@/core/authentication/roleValidations';

export default async function CreateProductType() {
  await validatePagePermissions('PTY:NN');
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
