'use server';

import { getOrderById } from '@/actions/order';
import { getUserAddresses } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import OrderForm from '@/components/Orders/OrderForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IOrder, IResponse } from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Orders | Catalos Admin',
  };
}

export default async function EditCart(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('ORD:LS');
  const awaitedParams = await ctx.params;

  const orderResponse: IResponse<IOrder> = await getOrderById(awaitedParams.id);

  if (orderResponse.success && !orderResponse.data) {
    console.error(orderResponse.message);
    redirect('/404');
  }

  if (orderResponse.data?.status === 'InProgress') {
    redirect(`/carts/${awaitedParams.id}`);
  }

  const addressResponse = await getUserAddresses(
    orderResponse.data?.userId || ''
  );

  const breadCrumbItems = [
    { label: 'Orders', href: '/orders' },
    { label: 'Manage Order', href: '#' },
  ];

  const isInProgress = orderResponse.data?.status === 'InProgress';

  return (
    <>
      <PageBreadcrumb
        pageTitle={`Manage Order #${orderResponse?.data?.id}`}
        items={breadCrumbItems}
        backUrl='/carts'
        badge={{
          color: isInProgress ? 'warning' : 'info',
          label: isInProgress ? 'In Progress' : 'Submitted',
        }}
      />
      <OrderForm
        permission={'ORD:NN'}
        order={orderResponse?.data}
        addresses={addressResponse?.data || []}
      />
    </>
  );
}
