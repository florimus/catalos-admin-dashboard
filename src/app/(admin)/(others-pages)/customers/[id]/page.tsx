'use server';

import { getOrders } from '@/actions/order';
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
  ISearchParams,
} from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Customer | Catalos Admin',
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
      <UserForm
        isInvitePendingUser={!customer.grandType}
        customer={customer}
        disableEdits={true}
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
