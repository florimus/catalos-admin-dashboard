'use server';

import { handleError } from '@/client/httpClient';
import { IPage, IProductType, IResponse } from '@/core/types';
import { cookies } from 'next/headers';

export const getProductTypeList = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IProductType>>> => {
  const cookieStore = await cookies();
  const url = new URL('/product-types/search', process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Product types fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch product types',
    };
  });
};
