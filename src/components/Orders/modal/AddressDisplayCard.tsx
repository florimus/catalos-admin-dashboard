'use client';

import Button from '@/components/ui/button/Button';
import SecureComponent from '@/core/authentication/SecureComponent';
import { IAddress } from '@/core/types';
import { useEffect, useState } from 'react';

interface IAddressDisplayCardProps {
  title: string;
  isEditing: boolean;
  updateAddress: (address: IAddress | null) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
  address?: IAddress | null;
  loading?: boolean;
  addresses?: IAddress[];
  children?: React.ReactNode;
}

const AddressDisplayCard: React.FC<IAddressDisplayCardProps> = ({
  title,
  address,
  isEditing,
  setIsEditing,
  updateAddress,
  addresses = [],
  loading = false,
  children,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(
    address || null
  );

  useEffect(() => {
    setSelectedAddress(address || null);
  }, [address]);

  const handleSelectAddress = async (address: IAddress) => {
    await updateAddress(address);
    setSelectedAddress(address);
  };

  if (isEditing) {
    return children;
  }

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-5`}
    >
      <div className='px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sm:px-8'>
        <h3 className='text-base font-medium text-gray-800 dark:text-white/90'>
          {title}
        </h3>
        {selectedAddress && (
          <SecureComponent permission="ORD:NN">
            <Button size='xm' onClick={() => setSelectedAddress(null)}>
              Edit
              {loading && (
                <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
              )}
            </Button>
          </SecureComponent>
        )}
      </div>

      {selectedAddress ? (
        <div className='px-4 border-t border-gray-100 dark:border-gray-800 sm:p-6'>
          <div>
            <p className='dark:text-gray-400 text-gray-700'>
              {selectedAddress.addressLine1}. {selectedAddress.addressLine2}
            </p>
            <p className='dark:text-gray-400 text-gray-700'>
              {selectedAddress.area}. {selectedAddress.city}.{' '}
              {selectedAddress.state}. {selectedAddress.country}
            </p>
            <p className='dark:text-gray-400 text-gray-700'>
              Contact: {selectedAddress.phone}
            </p>
            <p className='dark:text-gray-400 text-gray-700'>
              PIN: {selectedAddress.pinCode}
            </p>
          </div>
        </div>
      ) : (
        <SecureComponent permission="ORD:NN">
          {addresses?.map((address, index) => (
            <div
              key={index}
              className={`px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sm:px-8`}
            >
              <div className='flex items-start gap-2'>
                <input
                  type='checkbox'
                  name='address'
                  className='mt-2'
                  checked={false}
                  onChange={() => handleSelectAddress(address)}
                />
                <div>
                  <p className='dark:text-gray-400 text-gray-700'>
                    {address.addressLine1}. {address.addressLine2}
                  </p>
                  <p className='dark:text-gray-400 text-gray-700'>
                    {address.area}. {address.city}. {address.state}.{' '}
                    {address.country}
                  </p>
                  <p className='dark:text-gray-400 text-gray-700'>
                    Contact: {address.phone}
                  </p>
                  <p className='dark:text-gray-400 text-gray-700'>
                    PIN: {address.pinCode}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div
            onClick={() => setIsEditing(true)}
            className='dark:text-gray-400 text-gray-700 py-3 px-6 cursor-pointer'
          >
            New Address
          </div>
        </SecureComponent>
      )}
    </div>
  );
};

export default AddressDisplayCard;
