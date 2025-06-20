'use server';

import { handleError } from '@/client/httpClient';
import {
  IPage,
  IProduct,
  IProductCreateFormInputsWithAttributes,
  IProductStatusUpdate,
  IProductUpdateFormInputs,
  IResponse,
} from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createProductAPI = async (
  payload: IProductCreateFormInputsWithAttributes
): Promise<IResponse<IProduct>> => {
  const cookieStore = await cookies();
  const url = new URL('/products', process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Product created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create product',
    };
  });
};

export const getProducts = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IProduct>>> => {
  const cookieStore = await cookies();
  const url = new URL('/products/search', process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Products fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch products',
    };
  });
};

export const getProductById = async (
  id: string
): Promise<IResponse<IProduct>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/products/id/${id}`,
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
        message: 'Product fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch product',
    };
  });
};

export const updateProductApi = async (payload: IProductUpdateFormInputs) => {
  const cookieStore = await cookies();
  const url = new URL(
    `/products/id/${payload.id}`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
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
      revalidatePath(`/products/${payload.id}`);
      revalidatePath('/products');
      return {
        success: true,
        data: data.data,
        message: 'Product updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update product',
    };
  });
};

export const productStatusUpdateApi = async (
  id: string,
  active: boolean
): Promise<IResponse<IProductStatusUpdate>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/products/id/${id}/status/${active}`,
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
      revalidatePath(`/products/${id}`);
      revalidatePath('/products');
      return {
        success: true,
        data: data.data,
        message: 'Product status updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update product status',
    };
  });
};

export const getProductByCategoryId = async (
  id: string,
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IProduct>>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/products/category/${id}/search`,
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
        message: 'Products fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch products',
    };
  });
};
