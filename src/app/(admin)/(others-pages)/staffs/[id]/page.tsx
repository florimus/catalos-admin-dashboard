'use server';

import { getRoles } from '@/actions/role';
import { getUserInfoById } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import UserForm from '@/components/users/UserForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { ICustomerInfo, IPage, IResponse, IRole } from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Staff | Catalos Admin',
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
    { label: 'Staffs', href: '/staffs' },
    { label: customer.firstName, href: '#' },
  ];

  const initialRoles: IResponse<IPage<IRole>> = await getRoles();

  return (
    <>
      <PageBreadcrumb
        pageTitle={`${customer.firstName} ${
          customer.lastName ? customer.lastName : ''
        }`}
        items={breadCrumbItems}
      />
      <UserForm
        customer={customer}
        disableEdits={false}
        initialRoles={initialRoles.data}
      />
    </>
  );
}
