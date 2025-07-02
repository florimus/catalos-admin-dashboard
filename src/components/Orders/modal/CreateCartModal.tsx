'use client';

import { createCartAPI } from '@/actions/cart';
import { getUsers } from '@/actions/user';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import FormInModal from '@/components/modals/FormInModal';
import Alert from '@/components/ui/alert/Alert';
import Avatar from '@/components/ui/avatar/Avatar';
import Button from '@/components/ui/button/Button';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import SecureComponent from '@/core/authentication/SecureComponent';
import { CHANNELS } from '@/core/constants';
import {
  ICreateCartRequestInputs,
  IOrder,
  IResponse,
  IUserInfo,
} from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { ChevronDownIcon } from '@/icons';
import { channelToSingleSelectMapper, getChannelId } from '@/utils/mapperUtils';
import { isBlank } from '@/utils/stringUtils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CreateCartModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [customers, setCustomers] = useState<IUserInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const router = useRouter();
  const { start } = useGlobalLoader();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [cartCreateForm, setCartCreateForm] =
    useState<ICreateCartRequestInputs>({
      channelId: '',
      userId: '',
    });

  const handleCustomerSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    if (event.target.value?.trim() === '') {
      setCustomers([]);
      return;
    }
    const response = await getUsers(event.target.value);
    if (response.success && response.data?.hits) {
      setCustomers(response.data.hits);
    }
  };

  const handleChannelSelect = (channel: string) => {
    setCartCreateForm((prev) => ({
      ...prev,
      channelId: channel,
    }));
  };

  const handleCustomerSelect = (customer: IUserInfo) => {
    setCustomers([]);
    setEnableSearch(false);
    setCartCreateForm((prev) => ({
      ...prev,
      userId: customer.email,
    }));
  };

  const handleNewCustomerSelect = () => {
    if (searchTerm.trim() === '') {
      return;
    }
    setCustomers([]);
    setEnableSearch(false);
    setCartCreateForm((prev) => ({
      ...prev,
      userId: searchTerm,
    }));
  };

  const handleClearCustomerSelection = () => {
    setCustomers([]);
    setEnableSearch(true);
  };

  const handleSave = async () => {
    if (
      !isBlank(cartCreateForm?.channelId) &&
      !isBlank(cartCreateForm?.userId)
    ) {
      const response: IResponse<IOrder> = await createCartAPI(cartCreateForm);
      if (response.success && response.data) {
        setAlerts([
          {
            message: response.message || 'Cart created successfully',
            variant: 'success',
          },
        ]);
        start(() => router.push(`/carts/${response.data?.id}`));
      } else {
        setAlerts([
          {
            message: response.message || 'Failed to create cart',
            variant: 'error',
          },
        ]);
      }
    }
  };

  return (
    <>
      <SecureComponent permission='ORD:NN'>
        <Button size='sm' type='button' className='ml-2' onClick={openModal}>
          Create Cart
        </Button>
      </SecureComponent>
      {isOpen && (
        <FormInModal
          title='Create Cart'
          isOpen={isOpen}
          saveButtonText='Create Cart'
          closeModal={closeModal}
        >
          {Array.isArray(alerts) &&
            alerts.length > 0 &&
            alerts.map((alert) => (
              <Alert
                key={alert.message}
                message=''
                variant={
                  alert.variant as 'success' | 'error' | 'warning' | 'info'
                }
                title={alert.message}
              />
            ))}
          <div className='my-5'>
            <div>
              <Label>Channel</Label>
              <div className='relative'>
                <Select
                  options={channelToSingleSelectMapper(CHANNELS)}
                  placeholder={'Select Channel'}
                  defaultValue={
                    cartCreateForm.channelId
                      ? getChannelId(cartCreateForm.channelId)?.name
                      : ''
                  }
                  onChange={handleChannelSelect}
                  className='dark:bg-dark-900'
                  name='cart-channel_id'
                  required={true}
                  disabled={false}
                />
                <span className='absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400'>
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>
          {enableSearch ? (
            <>
              <Input
                type='search'
                placeholder='Search Customer'
                defaultValue={searchTerm}
                name='customer-cart_id'
                onChange={handleCustomerSearch}
              />
              <ul>
                {customers.length > 0 ? (
                  customers.map((customer, index) => (
                    <li
                      key={`customer_${customer.id}_${index}`}
                      className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                      onClick={() => {
                        handleCustomerSelect(customer);
                      }}
                    >
                      <div className='flex justify-items-center items-center'>
                        <Avatar
                          alt='New Customer'
                          src={
                            customer?.avatar || '/images/product/no-image.jpg'
                          }
                        />
                        <div className='ml-4'>
                          <span>{customer.firstName}</span>
                          <br />
                          <span className='opacity-50'>{customer.email}</span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li
                    key={`customer_new`}
                    className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                    onClick={handleNewCustomerSelect}
                  >
                    <div className='flex justify-items-center items-center'>
                      <Avatar
                        alt='New Customer'
                        src='/images/product/no-image.jpg'
                      />
                      <div className='ml-4'>
                        <span>New Customer</span>
                        <br />
                        <span className='opacity-50'>{searchTerm}</span>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </>
          ) : (
            <div className='grid grid-cols-[1fr_auto] gap-2 w-full'>
              <Input
                type='email'
                placeholder='Search Customer'
                name='customer-cart_id'
                disabled
                required
                defaultValue={cartCreateForm.userId}
                className='w-full'
              />
              <Button
                onClick={handleClearCustomerSelection}
                size='sm'
                variant='outline'
                type='button'
              >
                Change
              </Button>
            </div>
          )}
          <div className='flex items-center justify-end w-full gap-3 mt-6'>
            <Button size='sm' variant='outline' onClick={closeModal}>
              Close
            </Button>
            <Button size='sm' onClick={handleSave}>
              Create cart
            </Button>
          </div>
        </FormInModal>
      )}
    </>
  );
};

export default CreateCartModal;
