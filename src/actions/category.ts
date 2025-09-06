'use server';

import { handleError } from '@/client/httpClient';
import { ICategory, IPage, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
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

export const listCategoriesByIds = async (
  ids: string[]
): Promise<IResponse<ICategory[]>> => {
  const cookieStore = await cookies();
  const url = new URL('/category/list', process.env.NEXT_PUBLIC_API_BASE_URL);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({ ids }),
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
}

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
      revalidatePath('/categories');
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

export const getCategoryById = async (
  id: string
): Promise<IResponse<ICategory>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/category/id/${id}`,
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
        message: 'Category fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch category',
    };
  });
};

export const updateCategoryById = async (
  category: ICategory
): Promise<IResponse<ICategory>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/category/id/${category.id}`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify(category),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/categories');
      return {
        success: true,
        data: data.data,
        message: 'Category updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update category',
    };
  });
};

export const updateCategoryStatus = async (
  id: string,
  status: boolean
): Promise<IResponse<ICategory>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/category/id/${id}/status/${status}`,
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
      revalidatePath('/categories');
      return {
        success: true,
        data: data.data,
        message: 'Category status updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update category status',
    };
  });
};
