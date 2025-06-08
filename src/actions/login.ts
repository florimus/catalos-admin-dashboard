'use server';

import { ILoginResponse, IResponse } from '@/core/types';
import { cookies } from 'next/headers';

export const loginWithPassword = async (
  email: string,
  password: string
): Promise<IResponse<ILoginResponse>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const cookieStore = await cookies();

  return response
    .json()
    .then((data) => {
      if (data?.success) {
        cookieStore.set('accessToken', data.data.accessToken, {
          expires: new Date(data.data.expiresIn),
        });
        cookieStore.set('refreshToken', data.data.refreshToken, {
          expires: new Date(data.data.expiresIn),
        });
        return {
            success: true,
            message: 'Login successful',
        }
      }
      return {
        success: false,
        message: data?.message || 'Login failed',
      };
    })
};
