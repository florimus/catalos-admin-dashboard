'use server';

import { handleError } from '@/client/httpClient';
import { IResponse, ITranslation } from '@/core/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const getTranslationByUniqueIdAndLanguage = async (
  uniqueId: string,
  languageCode: string
): Promise<IResponse<ITranslation>> => {
  const cookieStore = await cookies();

  const url = new URL(
    `/translations/uniqueId/${uniqueId}/lang/${languageCode}`,
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
        message: 'translation fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch translations',
    };
  });
};

export const upsertTranslation = async (
  payload: ITranslation
): Promise<IResponse<ITranslation>> => {
  const cookieStore = await cookies();
  const url = new URL('translations', process.env.NEXT_PUBLIC_API_BASE_URL);
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
      revalidatePath(`/products/${payload.uniqueId}/translations`);
      return {
        success: true,
        data: data.data,
        message: 'Translation updated successfully',
      };
    }
    return {
      success: false,
      message: data?.message?.[0] || 'Failed to update translation',
    };
  });
};
