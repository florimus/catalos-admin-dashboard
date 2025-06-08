// lib/axios.ts
import axios from "axios";
import { cookies } from 'next/headers';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function httpClient() {
    const token = await cookies()
  
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
  
    if (token.get('accessToken')) {
      instance.defaults.headers.common.Authorization = `Bearer ${token.get('accessToken')}`;
    }
  
    return instance;
  }

export default axiosInstance;
