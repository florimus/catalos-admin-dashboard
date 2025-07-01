'use server';

import { handleError } from '@/client/httpClient';
import { IMiniOrder, IPage, IResponse } from '@/core/types';
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
