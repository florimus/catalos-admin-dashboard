'use server';

import { handleError } from '@/client/httpClient';
import { IAddress, IMiniOrder, IOrder, IPage, IPaymentLink, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getOrders = async (
  query: string = '',
  channel?: string,
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IMiniOrder>>> => {
  const cookieStore = await cookies();
  const url = new URL('/orders/search', process.env.NEXT_PUBLIC_API_BASE_URL);
  if (query) {
    query = query.trim();
    url.searchParams.append('query', query);
  }

  if (channel) {
    url.searchParams.append('query', channel.trim());
  }

  if (page >= 0) {
    url.searchParams.append('page', page.toString());
  }

  if (size >= 1) {
    url.searchParams.append('size', size.toString());
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Orders fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch Orders',
    };
  });
};

export const getOrderById = async (id: string): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL(`/orders/id/${id}`, process.env.NEXT_PUBLIC_API_BASE_URL);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Order fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch Order',
    };
  });
};

export const updateCartLineItem = async (
  id: string,
  quantity: number,
  variantId: string
): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL(`/orders/id/${id}`, process.env.NEXT_PUBLIC_API_BASE_URL);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      lineItems: [
        {
          variantId,
          quantity,
        },
      ],
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/carts');
      revalidatePath(`/carts/${id}`);
      return {
        success: true,
        data: data.data,
        message: 'Order item updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch order item',
    };
  });
};

export const removeCartLineItem = async (
  id: string,
  lineItems: string[]
): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/api/orders/id/${id}/line-items`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      lineItems,
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/carts');
      revalidatePath(`/carts/${id}`);
      return {
        success: true,
        data: data.data,
        message: 'Order item updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch order item',
    };
  });
};

export const updateCartLineItems = async (
  id: string,
  lineItems: { quantity: number; variantId: string }[]
): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL(`/orders/id/${id}`, process.env.NEXT_PUBLIC_API_BASE_URL);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      lineItems,
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/carts');
      revalidatePath(`/carts/${id}`);
      return {
        success: true,
        data: data.data,
        message: 'Order item updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch order item',
    };
  });
};

export const updateOrderAddress = async (
  orderId: string,
  address: IAddress
): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/api/orders/id/${orderId}/address`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      ...address,
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath(`/carts/${orderId}`);
      return {
        success: true,
        data: data.data,
        message: 'Order address updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update order address',
    };
  });
};

export const updatePaymentOption = async (
  orderId: string,
  paymentOptionId: string
): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/orders/id/${orderId}/option/${paymentOptionId}`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath(`/carts/${orderId}`);
      return {
        success: true,
        data: data.data,
        message: 'Order payment option updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update order payment option',
    };
  });
};

export const createPaymentLink = async (
  orderId: string
): Promise<IResponse<IPaymentLink>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/orders/id/${orderId}/link`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Payment link created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create payment link',
    };
  });
};