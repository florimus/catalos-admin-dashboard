'use server';

import { handleError } from '@/client/httpClient';
import {
  IPage,
  IPromotion,
  IPromotionFiler,
  IPromotionSearchProduct,
  IResponse,
} from '@/core/types';
import { getUTCDate } from '@/utils/timeUtils';
import { cookies } from 'next/headers';

export const getPromotions = async (
  query: string = '',
  channel: string = '',
  filter: IPromotionFiler,
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IPromotion>>> => {
  const cookieStore = await cookies();
  const url = new URL(
    '/promotions/search',
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
  if (query) {
    query = query.trim();
    url.searchParams.append('query', query);
  }

  if (channel) {
    channel = query.trim();
    url.searchParams.append('channel', channel);
  }

  if (page >= 0) {
    url.searchParams.append('page', page.toString());
  }

  if (size >= 1) {
    url.searchParams.append('size', size.toString());
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      ...filter,
      startDate: filter.startDate ? getUTCDate(filter.startDate) : undefined,
      expireDate: filter.expireDate ? getUTCDate(filter.expireDate) : undefined,
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Promotions fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch Promotions',
    };
  });
};

export const getPromotionById = async (
  id: string
): Promise<IResponse<IPromotion>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/promotions/id/${id}`,
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
        message: 'Promotions fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch promotions',
    };
  });
};

export const getPromotionProducts = async (
  productIds: string[],
  variantIds: string[],
  channel: string
): Promise<IResponse<IPromotionSearchProduct[]>> => {
  const cookieStore = await cookies();
  const url = new URL(
    '/products/product-variants',
    process.env.NEXT_PUBLIC_API_BASE_URL
  );

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
    },
    body: JSON.stringify({
      productIds,
      variantIds,
      channel,
    }),
  });

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      return {
        success: true,
        data: data.data,
        message: 'Promotions fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch promotions',
    };
  });
};
