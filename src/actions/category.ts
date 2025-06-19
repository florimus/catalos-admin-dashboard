'use server';

import { handleError } from '@/client/httpClient';
import { ICategory, IPage, IResponse } from '@/core/types';
import { cookies } from 'next/headers';

export const getCategories = async (
  query: string = '',
  page: number = 0,
  size: number = 10,
  parentId: string = ''
): Promise<IResponse<IPage<ICategory>>> => {
  const cookieStore = await cookies();
  const url = new URL('/category/search', process.env.NEXT_PUBLIC_API_BASE_URL);
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

  if (parentId) {
    url.searchParams.append('parent', parentId);
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
        message: 'categories fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch categories',
    };
  });
};

export const createCategoryAPI = async (
  category: ICategory
): Promise<IResponse<ICategory>> => {
  const cookieStore = await cookies();
  const url = new URL('/category', process.env.NEXT_PUBLIC_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify(category),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Category created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create category',
    };
  });
};
