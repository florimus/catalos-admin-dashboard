'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductTypeForm from '@/components/productTypes/ProductTypeForm';

export default async function CreateProductType() {
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
