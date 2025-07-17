/* eslint-disable @next/next/no-img-element */
'use client';

import { connectToCustomApp, installCustomApp } from '@/actions/customApp';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import ContainerModal from '@/components/modals/ContainerModal';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import { CHANNELS } from '@/core/constants';
import { IAppManifest } from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { BoltIcon, ChevronDownIcon, PlusIcon } from '@/icons';
import { channelToSingleSelectMapper } from '@/utils/mapperUtils';
import { useEffect, useState } from 'react';

const InstallCustomAppModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionString, setConnectionString] = useState<string>('');
  const [appInfo, setAppInfo] = useState<IAppManifest | null>();
  const [channel, setChannel] = useState<string>('');

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleConnect = async () => {
    if (connectionString) {
      setIsLoading(true);
      const response = await connectToCustomApp(connectionString);
      setIsLoading(false);
      if (response.success) {
        setAppInfo(response.data);
      } else {
        setAlerts([
          {
            message: response.message || 'Failed to connect to custom app',
            variant: 'error',
          },
        ]);
      }
    }
  };

  const handleInstall = async () => {
    if (!appInfo) {
      setAlerts([
        {
          message: 'Please connect to a custom app first',
          variant: 'error',
        },
      ]);
      return null;
    }
    const response = await installCustomApp({
      ...appInfo,
      connectionUrl: connectionString,
      applicableChannels: [channel],
    });
    if (response.success) {
      setAlerts([
        {
          message: 'Custom app installed successfully',
          variant: 'success',
        },
      ]);
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to install custom app',
          variant: 'error',
        },
      ]);
    }
  };

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  return (
    <>
      <Button size='xm' onClick={openModal}>
        <BoltIcon /> Install
      </Button>
      {isOpen && (
        <ContainerModal
          title='Install Custom App'
          isOpen={isOpen}
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
          {!appInfo && (
            <div className='my-5'>
              <Label>Connection URL</Label>
              <Input
                type='link'
                placeholder='https://example.com'
                defaultValue={connectionString}
                name='customer-cart_id'
                className='mt-2'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConnectionString(e.target.value);
                }}
              />
            </div>
          )}
          <div className='my-5'>
            {appInfo && (
              <>
                <div className='flex items-center justify-center  '>
                  <img
                    width={64}
                    height={64}
                    className='rounded-md'
                    src={appInfo?.logo}
                    alt='custom-apps'
                  />
                  <PlusIcon className='text-gray-400 mx-5' />
                  <img
                    width={64}
                    height={64}
                    className='rounded-md border border-gray-200 dark:border-gray-800'
                    src='/images/logo/logo-icon.svg'
                    alt='custom-apps'
                  />
                </div>
                <p className='text-center text-gray-400 dark:text-gray-500 my-3'>
                  Install {appInfo?.name}
                </p>
                <div>
                  <Label>Channel</Label>
                  <div className='relative'>
                    <Select
                      options={channelToSingleSelectMapper(CHANNELS)}
                      placeholder={'Select Channel'}
                      defaultValue={''}
                      onChange={setChannel}
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
              </>
            )}
          </div>
          <div className='flex items-center justify-end w-full gap-3 mt-6'>
            <Button size='sm' variant='outline' onClick={closeModal}>
              Close
            </Button>
            <Button
              size='sm'
              disabled={isLoading}
              onClick={appInfo ? handleInstall : handleConnect}
            >
              Connect {isLoading && statusLoader}
            </Button>
          </div>
        </ContainerModal>
      )}
    </>
  );
};

// {
//       fieldType: FormFieldType.MultiSelect,
//       name: 'publishedChannels',
//       label: 'Select Published Channels',
//       options: channelToMultiSelectMapper(CHANNELS),
//       defaultSelected: createProductForm.publishedChannels,
//       onChange: (selected: string[]) => {
//         setCreateProductForm((prev) => ({
//           ...prev,
//           publishedChannels: selected,
//         }));
//       },
//     },

export default InstallCustomAppModal;
