'use client';

import { createAPIKey } from '@/actions/apiKey';
import { getRoles } from '@/actions/role';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ContainerModal from '@/components/modals/ContainerModal';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import SecureComponent from '@/core/authentication/SecureComponent';
import { IAPIKeyWithSecret, IResponse, IRole } from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { CopyIcon } from '@/icons';
import { useEffect, useState } from 'react';

const CreateApiModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [apiKeyName, setApiKeyName] = useState<string>('');
  const [roles, setRoles] = useState<IRole[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [apiCredentials, setApiCredentials] =
    useState<IAPIKeyWithSecret | null>(null);

  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleFieldChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setApiKeyName(event.target.value);
  };

  const handleRoleSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setRoles([]);
      return;
    }
    const response = await getRoles(searchTerm);
    if (response.success && response.data?.hits) {
      setRoles(response.data.hits);
    }
  };

  const handleRoleSelect = async (role: IRole) => {
    setSelectedRole(role);
    setEnableSearch(false);
  };

  const handleClearSelectedRoleSelection = () => {
    setSelectedRole(null);
    setEnableSearch(true);
  };

  const handleSave = async () => {
    if (!apiKeyName || !apiKeyName.trim() || !selectedRole) {
      setAlerts([
        {
          message: 'Please fill all the required fields',
          variant: 'error',
        },
      ]);
      return;
    }
    setIsLoading(true);
    const response: IResponse<IAPIKeyWithSecret> = await createAPIKey(
      apiKeyName,
      selectedRole.uniqueId
    );
    setIsLoading(false);

    if (response.success && response.data) {
      setApiCredentials(response.data);
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to create api key',
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
      <SecureComponent permission='API:NN'>
        <Button size='sm' type='button' className='ml-2' onClick={openModal}>
          Create Api Key
        </Button>
      </SecureComponent>
      {isOpen && (
        <ContainerModal
          title='Create New API Key'
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
          {apiCredentials?.active ? (
            <>
              <Alert
                variant='warning'
                title='Shh..! This is your API Key'
                message='Please do not share this with unauthorized people, Please save it somewhere safe, You WILL NOT SEE this again.'
              />
              <div className='mt-5'>
                <Label>API Key</Label>
                <div className='grid grid-cols-[1fr_auto] gap-2 w-full'>
                  <Input
                    type='text'
                    placeholder='API Key'
                    name='selected-role'
                    disabled
                    value={apiCredentials?.apiKey}
                    className='w-full'
                  />
                  <Button
                    onClick={() => {
                      if (apiCredentials?.apiKey) {
                        navigator.clipboard.writeText(apiCredentials?.apiKey);
                      }
                    }}
                    size='sm'
                    variant='outline'
                    type='button'
                  >
                    <CopyIcon />
                  </Button>
                </div>
              </div>
              <div className='my-5'>
                <Label>API Secret</Label>
                <div className='grid grid-cols-[1fr_auto] gap-2 w-full'>
                  <Input
                    type='text'
                    placeholder='API Key'
                    name='selected-role'
                    disabled
                    value={apiCredentials?.apiSecret}
                    className='w-full'
                  />
                  <Button
                    onClick={() => {
                      if (apiCredentials?.apiSecret) {
                        navigator.clipboard.writeText(
                          apiCredentials?.apiSecret
                        );
                      }
                    }}
                    size='sm'
                    variant='outline'
                    type='button'
                  >
                    <CopyIcon />
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-end w-full gap-3 mt-6'>
                <Button size='sm' variant='primary' onClick={closeModal}>
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className='my-5'>
                <Label>Api Key Name</Label>
                <Input
                  type='text'
                  placeholder='Search Api key Name...'
                  value={apiKeyName}
                  name='api-key-name'
                  onChange={handleFieldChange}
                />
              </div>

              {enableSearch ? (
                <div>
                  <Label>Search Role</Label>
                  <Input
                    type='search'
                    placeholder='Search Roles...'
                    value={searchTerm}
                    name='api-key-role-search'
                    onChange={handleRoleSearch}
                  />
                  <ul>
                    {roles.length > 0
                      ? roles.map((role, index) => (
                          <li
                            key={`customer_${role.id}_${index}`}
                            className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                            onClick={() => {
                              handleRoleSelect(role);
                            }}
                          >
                            <div className='flex justify-items-center items-center'>
                              <span>{role.name}</span>
                            </div>
                          </li>
                        ))
                      : ''}
                  </ul>
                </div>
              ) : (
                <div className=' '>
                  <Label>Api Key Role</Label>
                  <div className='grid grid-cols-[1fr_auto] gap-2 w-full'>
                    <Input
                      type='text'
                      placeholder='Selected Role'
                      name='selected-role'
                      disabled
                      required
                      value={selectedRole?.name || ''}
                      className='w-full'
                    />
                    <Button
                      onClick={handleClearSelectedRoleSelection}
                      size='sm'
                      variant='outline'
                      type='button'
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}
              <div className='flex items-center justify-end w-full gap-3 mt-6'>
                <Button size='sm' variant='outline' onClick={closeModal}>
                  Close
                </Button>
                <Button size='sm' disabled={isLoading} onClick={handleSave}>
                  Create API Keys {isLoading && statusLoader}
                </Button>
              </div>
            </>
          )}
        </ContainerModal>
      )}
    </>
  );
};

export default CreateApiModal;
