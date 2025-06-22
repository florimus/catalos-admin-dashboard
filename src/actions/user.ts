'use server';

import { handleError } from '@/client/httpClient';
import { ICustomerInfo, IPage, IResponse, IUserInfo } from '@/core/types';
import { revalidatePath } from 'next/cache';
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
    handleError(data);
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

export const getUserInfoById = async (
  id: string
): Promise<IResponse<ICustomerInfo>> => {
  const cookieStore = await cookies();
  const url = new URL(`/users/id/${id}`, process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'User fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch user',
    };
  });
};

export const fetchUserInfoWithoutCookies: () => Promise<
  IResponse<IUserInfo>
> = async () => {
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
    handleError(data);
    if (data?.success) {
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

export const getUserInfo: () => Promise<IUserInfo | null> = async () => {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get('userInfo')?.value;

  if (userInfo) {
    return JSON.parse(userInfo);
  }

  cookieStore.delete('userInfo');
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
};

export const updateUserInfo = async (
  firstName: string,
  lastName: string,
  userGroupId: string = ''
): Promise<IResponse<IUserInfo>> => {
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
      },
      body: JSON.stringify({ firstName, lastName, userGroupId }),
    }
  );

  return response.json().then((data) => {
    handleError(data);
    if (data?.success) {
      cookieStore.set('userInfo', JSON.stringify(data.data));
      revalidatePath('/profile');
      return {
        success: true,
        data: data.data,
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to update user info',
    };
  });
};

export const getUsers = async (
  query: string = '',
  page: number = 0,
  size: number = 10
): Promise<IResponse<IPage<IUserInfo>>> => {
  const cookieStore = await cookies();
  const url = new URL('/users/search', process.env.NEXT_PUBLIC_API_BASE_URL);
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
        message: 'Users fetched successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to fetch Users',
    };
  });
};
