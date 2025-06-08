'use client';

import React, {useState } from 'react';
import SignInFormView from './SignInFormView';
import { ILoginFormProps, ILoginResponse, IResponse } from '@/core/types';
import { loginWithPassword } from '@/actions/login';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ILoginFormProps>({
    email: '',
    password: '',
    rememberMe: isChecked,
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target || {};

    if (message) {
      setMessage(null);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response: IResponse<ILoginResponse> = await loginWithPassword(formData.email, formData.password);
    if (response.success) {
      router.push('/');
    } else {
      setMessage(response.message || 'Login failed');
    }
  };

  return (
    <SignInFormView
      showPassword={showPassword}
      setIsChecked={setIsChecked}
      isChecked={isChecked}
      setShowPassword={setShowPassword}
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      message={message}
    />
  );
}
