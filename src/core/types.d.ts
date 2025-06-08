export interface IResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ILoginFormProps {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IUserInfo {
  id: string;
  userGroupId: string;
  firstName: string;
  lastName: string;
  email: string;
  grandType: string;
  roleId: string;
  verified: boolean;
  active: boolean;
  permissions: string;
}
