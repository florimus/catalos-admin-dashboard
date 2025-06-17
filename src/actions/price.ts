'use server';

import { handleError } from '@/client/httpClient';
import { IPrice, IResponse } from '@/core/types';
import { cookies } from 'next/headers';

export const getPriceBySku = async (
  skuId: string
): Promise<IResponse<IPrice>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/prices/sku/${skuId}`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

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
        message: 'Price fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch price',
    };
  });
};

export const updatePrice = async (
  payload: IPrice
): Promise<IResponse<IPrice>> => {
  const cookieStore = await cookies();
  const url = new URL(`/prices`, process.env.NEXT_PUBLIC_API_BASE_URL);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify(payload),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Price updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update price',
    };
  });
};
