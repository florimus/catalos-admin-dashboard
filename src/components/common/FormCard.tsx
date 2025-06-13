'use client';

import React, { FormEvent } from 'react';
import Form from '../form/Form';
import Button from '../ui/button/Button';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  ctaLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  children,
  ctaLabel,
  className = '',
  onSubmit = () => {},
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <Form onSubmit={onSubmit}>
        <div className='px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sm:px-8'>
          <h3 className='text-base font-medium text-gray-800 dark:text-white/90'>
            {title}
          </h3>
          <Button size='sm' type="submit">{ctaLabel}</Button>
        </div>

        <div className='p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6'>
          <div className='space-y-6'>{children}</div>
        </div>
      </Form>
    </div>
  );
};

export default FormCard;
