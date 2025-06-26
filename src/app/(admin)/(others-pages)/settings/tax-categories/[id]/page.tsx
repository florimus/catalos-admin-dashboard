'use server';

import { getTaxById } from '@/actions/tax';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TaxForm from '@/components/settings/tax-categories/TaxForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IResponse, ITax } from '@/core/types';
import { redirect } from 'next/navigation';

export default async function EditTaxPage(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('TAX:LS');
  const awaitedParam = await ctx.params;

  const taxResponse: IResponse<ITax> = await getTaxById(awaitedParam.id);

  if (!taxResponse.success || !taxResponse.data) {
    console.error(taxResponse.message);
    redirect('/404');
  }

  const tax = taxResponse.data;

  const breadCrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'Tax Categories', href: '/settings/tax-categories' },
    { label: tax.name, href: '#' },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle={tax.name}
        items={breadCrumbItems}
        backUrl='/settings/tax-categories'
      />
      <TaxForm tax={tax} />
    </>
  );
}
