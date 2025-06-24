'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DEFAULT_ROLE } from '../constants';

const handleDefaultRole = (role: string) => {
  if (role === DEFAULT_ROLE) {
    redirect('/403');
  }
};

export const validatePagePermissions = async (role: string) => {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get('userInfo')?.value;
  if (userInfo) {
    const user = JSON.parse(userInfo);
    handleDefaultRole(user.roleId);

    const roles = user?.permissions?.split(',') || [];
    if (roles.includes(role)) {
      return true;
    }
  }
  return redirect('/');
};
