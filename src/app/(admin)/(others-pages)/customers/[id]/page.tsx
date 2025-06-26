'use server';

import { getUserInfoById } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import UserForm from '@/components/users/UserForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { ICustomerInfo, IResponse } from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Customer | Catalos Admin',
  };
}

export default async function EditCustomer(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('USR:LS');
  const awaitedParam = await ctx.params;

  const userResponse: IResponse<ICustomerInfo> = await getUserInfoById(
    awaitedParam.id
  );

  if (!userResponse.success || !userResponse.data) {
    console.error(userResponse.message);
    redirect('/404');
  }

  const customer = userResponse.data;

  const breadCrumbItems = [
    { label: 'Customers', href: '/customers' },
    { label: customer.firstName, href: '#' },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle={`${customer.firstName} ${
          customer.lastName ? customer.lastName : ''
        }`}
        items={breadCrumbItems}
      />
      <UserForm customer={customer} disableEdits={true} />
    </>
  );
}
