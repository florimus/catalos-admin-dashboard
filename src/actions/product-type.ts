'use server';

import { handleError } from '@/client/httpClient';
import {
  IPage,
  IProductType,
  IProductTypeFormInputs,
  IProductTypeStatusUpdate,
  IResponse,
} from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getProductTypeList = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IProductType>>> => {
  const cookieStore = await cookies();
  const url = new URL(
    '/product-types/search',
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
        message: 'Product types fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch product types',
    };
  });
};

export const getProductTypeById = async (
  id: string
): Promise<IResponse<IProductType>> => {
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product-types/id/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
      },
    }
  );

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Product-type fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch product-type',
    };
  });
};

export const createProductTypeAPI = async (
  payload: IProductTypeFormInputs
): Promise<IResponse<IProductType>> => {
  const cookieStore = await cookies();
  const url = new URL('/product-types', process.env.NEXT_PUBLIC_API_BASE_URL);
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
      return {
        success: true,
        data: data.data,
        message: 'Product-type created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create product-type',
    };
  });
};

export const updateProductTypeAPI = async (
  payload: IProductTypeFormInputs
): Promise<IResponse<IProductType>> => {
  const cookieStore = await cookies();
  const url = new URL('/product-types', process.env.NEXT_PUBLIC_API_BASE_URL);
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
      revalidatePath('/product-types');
      revalidatePath(`/product-types/${data.data.id}`);
      return {
        success: true,
        data: data.data,
        message: 'Product-type updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update product-type',
    };
  });
};

export const updateProductTypeStatusAPI = async (
  id: string,
  active: boolean
): Promise<IResponse<IProductTypeStatusUpdate>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/product-types/id/${id}/status/${active}`,
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
      revalidatePath(`/product-types/${id}`);
      revalidatePath('/product-types');
      return {
        success: true,
        data: data.data,
        message: 'Product-type status updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update product-type status',
    };
  });
};
