'use server';

import { handleError } from '@/client/httpClient';
import { IAPIKey, IAPIKeyWithSecret, IPage, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getAPIKeys = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IAPIKey>>> => {
  const cookieStore = await cookies();
  const url = new URL(
    '/secure-keys/search',
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
        message: 'api keys fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch api keys',
    };
  });
};

export const createAPIKey = async (
  name: string,
  roleId: string
): Promise<IResponse<IAPIKeyWithSecret>> => {
  const cookieStore = await cookies();
  const url = new URL('/secure-keys', process.env.NEXT_PUBLIC_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      name,
      roleId,
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/api-keys');
      return {
        success: true,
        data: data.data,
        message: 'api key created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create api key',
    };
  });
};
