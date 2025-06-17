'use server';

import { handleError } from '@/client/httpClient';
import { IResponse, IStock } from '@/core/types';
import { cookies } from 'next/headers';

export const getStockByVariantId = async (
  variantId: string
): Promise<IResponse<IStock>> => {
  const cookieStore = await cookies();

  const url = new URL(
    `/stocks/variantId/${variantId}`,
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
        message: 'Stock fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch stock',
    };
  });
};

export const updateStockAPI = async (
  payload: IStock
): Promise<IResponse<IStock>> => {
  const cookieStore = await cookies();

  const url = new URL(`/stocks`, process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Stock updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update stock',
    };
  });
};
