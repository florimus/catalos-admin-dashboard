'use server';

import { IResponse, IUserInfo } from '@/core/types';
import { cookies } from 'next/headers';

export const fetchUserInfo: () => Promise<IResponse<IUserInfo>> = async () => {
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
      },
    }
  );

  return response.json().then((data) => {
    if (data?.success) {
      cookieStore.set('userInfo', JSON.stringify(data.data));
      return {
        success: true,
        data: data.data,
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch user info',
    };
  });
};

export const getUserInfo: ()=> Promise<IUserInfo | null> = async () => {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get('userInfo')?.value;

  if (userInfo) {
    return JSON.parse(userInfo);
  }

  cookieStore.delete('userInfo');
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}
