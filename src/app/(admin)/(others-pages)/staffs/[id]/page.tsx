'use server';

import { getOrders } from '@/actions/order';
import { getRoles } from '@/actions/role';
import { getUserInfoById } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import OrderList from '@/components/Orders/OrdersList';
import UserForm from '@/components/users/UserForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import SecureComponent from '@/core/authentication/SecureComponent';
import {
  ICustomerInfo,
  IMiniOrder,
  IPage,
  IResponse,
  IRole,
  ISearchParams,
} from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Staff | Catalos Admin',
  };
}

export default async function EditCustomer(ctx: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<ISearchParams | null>;
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

  const searchParams: ISearchParams | null = (await ctx.searchParams) || {};

  const orderResponse: IResponse<IPage<IMiniOrder>> = await getOrders(
    customer.email,
    searchParams?.channel,
    searchParams?.page,
    searchParams?.size
  );

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
        isInvitePendingUser={!customer.grandType}
      />
      <SecureComponent permission='ORD:LS'>
        <p className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 mx-4'>
          Orders
        </p>
        <div className='space-y-6'>
          <OrderList {...(orderResponse.data || {})} />
        </div>
      </SecureComponent>
    </>
  );
}
