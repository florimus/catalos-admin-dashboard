'use server';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TaxForm from '@/components/settings/tax-categories/TaxForm';
import { validatePermissions } from '@/core/authentication/roleValidations';

export async function generateMetadata() {
  return {
    title: 'Create Tax Categories | Catalos Admin',
  };
}

export default async function CreateTaxPage() {
  await validatePermissions('TAX:NN');
  const breadCrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'Tax Categories', href: '/settings/tax-categories' },
    { label: 'Create Tax', href: '#' },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle='Create Tax' items={breadCrumbItems} />
      <TaxForm />
    </>
  );
}
