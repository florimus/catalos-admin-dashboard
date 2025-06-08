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