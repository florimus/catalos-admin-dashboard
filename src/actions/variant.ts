'use server';

import { handleError } from '@/client/httpClient';
import { IPage, IResponse, IVariant, IVariantFormInputs } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getVariantsByProductId = async (
  productId: string,
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IVariant>>> => {
  const cookieStore = await cookies();

  const url = new URL(
    `/variants/productId/${productId}/search`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  if (query) {
    query = query.trim();
    url.searchParams.append('query', query);
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
        message: 'Variants fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch product variants',
    };
  });
};

export const createVariantAPI = async (
  payload: IVariantFormInputs
): Promise<IResponse<IVariant>> => {
  const cookieStore = await cookies();
  
  const url = new URL('/variants', process.env.NEXT_PUBLIC_API_BASE_URL);
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
      revalidatePath(`/products/${payload.productId}`);
      return {
        success: true,
        data: data.data,
        message: 'Variant created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create variant',
    };
  });
};
