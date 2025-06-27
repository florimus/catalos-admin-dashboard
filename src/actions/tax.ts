'use server';

import { handleError } from '@/client/httpClient';
import { IPage, IResponse, ITax, ITaxStatusUpdate } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getTaxes = async (
  query: string = '',
  page: number = 0,
  size: number = 10,
  channels?: string
): Promise<IResponse<IPage<ITax>>> => {
  const cookieStore = await cookies();
  const url = new URL('/taxes/search', process.env.NEXT_PUBLIC_API_BASE_URL);
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

  if (channels) {
    url.searchParams.append('channels', channels);
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
        message: 'Taxes fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch taxes',
    };
  });
};

export const getTaxById = async (id: string): Promise<IResponse<ITax>> => {
  const cookieStore = await cookies();

  const url = new URL(`/taxes/id/${id}`, process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Tax fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch Tax',
    };
  });
};

export const updateTaxById = async (
  payload: ITax
): Promise<IResponse<ITax>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/taxes/id/${payload.id}`,
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
      revalidatePath('/settings/tax-categories');
      return {
        success: true,
        data: data.data,
        message: 'Tax updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update tax',
    };
  });
};

export const createTaxAPI = async (payload: ITax): Promise<IResponse<ITax>> => {
  const cookieStore = await cookies();
  const url = new URL('/taxes', process.env.NEXT_PUBLIC_API_BASE_URL);
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
      revalidatePath('/settings/tax-categories');
      return {
        success: true,
        data: data.data,
        message: 'Tax created successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to create tax',
    };
  });
};

export const updateTaxStatusById = async (
  id: string,
  status: boolean
): Promise<IResponse<ITaxStatusUpdate>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/taxes/id/${id}/status/${status}`,
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
      revalidatePath('/settings/tax-categories');
      return {
        success: true,
        data: data.data,
        message: 'Tax status updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update tax status',
    };
  });
};
