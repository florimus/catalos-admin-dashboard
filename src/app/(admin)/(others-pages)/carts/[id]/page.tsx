'use server';

import { getOrderById } from '@/actions/order';
import { getUserAddresses } from '@/actions/user';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CartForm from '@/components/Orders/CartForm';
import { validatePermissions } from '@/core/authentication/roleValidations';
import { IOrder, IResponse } from '@/core/types';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Carts | Catalos Admin',
  };
}

export default async function EditCart(ctx: {
  params: Promise<{ id: string }>;
}) {
  await validatePermissions('ORD:LS');
  const awaitedParams = await ctx.params;

  const cartResponse: IResponse<IOrder> = await getOrderById(awaitedParams.id);

  if (cartResponse.success && !cartResponse.data) {
    console.error(cartResponse.message);
    redirect('/404');
  }

  const addressResponse = await getUserAddresses(
    cartResponse.data?.userId || ''
  );

  const breadCrumbItems = [
    { label: 'Carts', href: '/carts' },
    { label: 'Edit Cart', href: '#' },
  ];

  const isInProgress = cartResponse.data?.status === 'InProgress';

  return (
    <>
      <PageBreadcrumb
        pageTitle={'Edit Cart'}
        items={breadCrumbItems}
        backUrl='/carts'
      />
      <CartForm
        permission={isInProgress ? 'ORD:NN' : 'NO:EDITS'}
        cart={cartResponse?.data}
        addresses={addressResponse?.data || []}
      />
    </>
  );
}
