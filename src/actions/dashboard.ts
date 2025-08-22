'use server';

import { handleError } from '@/client/httpClient';
import { IDashboardData, IResponse } from '@/core/types';
import { cookies } from 'next/headers';

export const getDashboardData = async (): Promise<
  IResponse<IDashboardData>
> => {
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`,
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
        message: 'dashboard info fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to fetch dashboard data',
    };
  });
};
