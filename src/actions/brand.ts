'use server';

import { handleError } from '@/client/httpClient';
import { IBrand, IPage, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getBrands = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IBrand>>> => {
  const cookieStore = await cookies();
  const url = new URL('/brands/search', process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'categories fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch categories',
    };
  });
};

export const listBrandByIds = async (
  ids: string[]
): Promise<IResponse<IBrand[]>> => {
  const cookieStore = await cookies();
  const url = new URL('/brands/list', process.env.NEXT_PUBLIC_API_BASE_URL);
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

export const createBrandAPI = async (
  brand: IBrand
): Promise<IResponse<IBrand>> => {
  const cookieStore = await cookies();
  const url = new URL('/brands', process.env.NEXT_PUBLIC_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify(brand),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/brands');
      return {
        success: true,
        data: data.data,
        message: 'Brand created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create brand',
    };
  });
};

export const getBrandById = async (id: string): Promise<IResponse<IBrand>> => {
  const cookieStore = await cookies();
  const url = new URL(`/brands/id/${id}`, process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Brand fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch brand',
    };
  });
};

export const updateBrandAPI = async (
  brand: IBrand
): Promise<IResponse<IBrand>> => {
  const cookieStore = await cookies();
  const url = new URL(`/brands/id/${brand.id}`, process.env.NEXT_PUBLIC_API_BASE_URL);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify(brand),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      revalidatePath('/brands');
      return {
        success: true,
        data: data.data,
        message: 'Brand updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update brand',
    };
  });
};

export const updateBrandStatusAPI = async (
  id: string,
  status: boolean
): Promise<IResponse<IBrand>> => {
  const cookieStore = await cookies();
  const url = new URL(`/brands/id/${id}/status/${status}`, process.env.NEXT_PUBLIC_API_BASE_URL);
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
      revalidatePath('/brands');
      return {
        success: true,
        data: data.data,
        message: 'Brand status updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update brand status',
    };
  });
};
