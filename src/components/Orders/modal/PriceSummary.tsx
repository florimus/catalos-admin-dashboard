'use client';
import React, { FC } from 'react';
import FormCard from '@/components/common/FormCard';

interface IPriceSummaryProps {
  currency: string;
  itemList: {
    label: string;
    value: string;
    isBold?: boolean;
  }[];
}

const PriceSummary: FC<IPriceSummaryProps> = ({ itemList = [], currency }) => {
  return (
    <FormCard title='PriceSummary'>
      {itemList.map((item) => (
        <div key={item.label} className='flex justify-between'>
          <p className='text-gray-800 dark:text-gray-200 opacity-65'>
            {item.label}
          </p>
          <p
            className={`text-gray-800 ${
              item?.isBold ? ' font-extrabold ' : ' '
            } dark:text-gray-200 opacity-60`}
          >
            {currency} {item.value}
          </p>
        </div>
      ))}
    </FormCard>
  );
};

export default PriceSummary;
