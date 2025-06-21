'use server';

import { handleError } from '@/client/httpClient';
import { IModule, IResponse } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getModuleById = async (
  id: string
): Promise<IResponse<IModule>> => {
  const cookieStore = await cookies();
  const url = new URL(
    `/modules/id/${id}`,
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
        message: 'Price fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch price',
    };
  });
};

export const updateModule = async (
  payload: IModule
): Promise<IResponse<IModule>> => {
  const cookieStore = await cookies();
  const url = new URL(`/modules`, process.env.NEXT_PUBLIC_API_BASE_URL);

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
      revalidatePath(`/variants/${payload.resourceId}`);
      return {
        success: true,
        data: data.data,
        message: 'Module updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update module',
    };
  });
};
