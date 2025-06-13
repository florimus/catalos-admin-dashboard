'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CreateProductForm from '@/components/products/CreateProduct';

export default async function CreateProduct() {
  const breadCrumbItems = [
    { label: 'Products', href: '/products' },
    { label: 'Create Product', href: '/products/create' },
  ];
  return (
    <>
      <PageBreadcrumb pageTitle='Create Product' items={breadCrumbItems} />
      <CreateProductForm />
    </>
  );
}
