import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { ILoginFormProps } from '@/core/types';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import Link from 'next/link';
import { FC } from 'react';
import ComponentCard from '../common/ComponentCard';
import Alert from '../ui/alert/Alert';

interface SignInFormViewProps {
  showPassword: boolean;
  setIsChecked: (value: boolean) => void;
  isChecked: boolean;
  message?: string | null;
  formData: ILoginFormProps | undefined;
  setShowPassword: (value: boolean) => void;
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignInFormView: FC<SignInFormViewProps> = ({
  showPassword,
  setIsChecked,
  isChecked,
  message,
  formData,
  setShowPassword,
  handleSubmit,
  handleInputChange,
}) => {
  return (
    <div className='flex flex-col flex-1 lg:w-1/2 w-full'>
      <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
        <div>
          <div className='mb-5 sm:mb-8'>
            <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
              Sign In
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Enter your email and password to sign in!
            </p>
          </div>

          {message && (
            <div className='mb-7'>
              <Alert
                variant='error'
                title='Login failed'
                message={message || 'Please check your email and password.'}
                showLink={false}
              />
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className='space-y-6'>
                <div>
                  <Label>
                    Email <span className='text-error-500'>*</span>{' '}
                  </Label>
                  <Input
                    placeholder='info@gmail.com'
                    name='email'
                    id='email'
                    type='email'
                    value={formData?.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className='text-error-500'>*</span>{' '}
                  </Label>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      name='password'
                      id='password'
                      value={formData?.password}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2'
                    >
                      {showPassword ? (
                        <EyeIcon className='fill-gray-500 dark:fill-gray-400' />
                      ) : (
                        <EyeCloseIcon className='fill-gray-500 dark:fill-gray-400' />
                      )}
                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className='block font-normal text-gray-700 text-theme-sm dark:text-gray-400'>
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href='/reset-password'
                    className='text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button type='submit' className='w-full' size='sm'>
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className='mt-5'>
              <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                Don&apos;t have an account? {''}
                <Link
                  href='/signup'
                  className='text-brand-500 hover:text-brand-600 dark:text-brand-400'
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInFormView;
