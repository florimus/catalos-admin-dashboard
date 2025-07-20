'use server';

import { handleError } from '@/client/httpClient';
import { IAppManifest, ICustomApp, IPage, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getCustomApps = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<ICustomApp>>> => {
  const cookieStore = await cookies();
  const url = new URL(
    '/custom-apps/search',
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
        message: 'custom apps fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch custom apps',
    };
  });
};

export const installCustomApp = async (
  payload: IAppManifest
): Promise<IResponse<ICustomApp>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/custom-apps/install`,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
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
      revalidatePath('/custom-apps');
      return {
        success: true,
        data: data.data,
        message: 'Custom app installed successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to install custom app',
    };
  });
};

export const connectToCustomApp = async (
  connectionUrl: string
): Promise<IResponse<ICustomApp>> => {
  try {
    const url = new URL(`/api/manifest`, connectionUrl);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json().then((data) => {
      return {
        success: true,
        data: data,
        message: 'Custom app connected successfully',
      };
    });
  } catch {
    return {
      success: false,
      message: 'Failed to connect to custom app',
    };
  }
};
