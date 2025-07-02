'use server';

import { handleError } from '@/client/httpClient';
import { ICreateCartRequestInputs, IOrder, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createCartAPI = async (
  payload: ICreateCartRequestInputs
): Promise<IResponse<IOrder>> => {
  const cookieStore = await cookies();
  const url = new URL('/orders', process.env.NEXT_PUBLIC_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/carts');
      return {
        success: true,
        data: data.data,
        message: 'Cart created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create cart',
    };
  });
};
