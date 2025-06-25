'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DEFAULT_ROLE } from '../constants';

const handleDefaultRole = (role: string, avoidRedirect: boolean = false) => {
  if (role === DEFAULT_ROLE) {
    if (avoidRedirect) {
      return false;
    } else {
      redirect('/403');
    }
  }
};

export const validatePermissions = async (
  role: string,
  avoidRedirect: boolean = false
) => {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get('userInfo')?.value;
  if (userInfo) {
    const user = JSON.parse(userInfo);
    handleDefaultRole(user.roleId, avoidRedirect);

    const roles = user?.permissions?.split(',') || [];

    if (roles.includes(role)) {
      return true;
    }
  }
  return avoidRedirect ? false : redirect('/');
};
