'use client';

import { getRoles } from '@/actions/role';
import { inviteUser } from '@/actions/user';
import Input from '@/components/form/input/InputField';
import ContainerModal from '@/components/modals/ContainerModal';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import { IPage, IRole } from '@/core/types';
import { useModal } from '@/hooks/useModal';
import { rolesToSingleSelectMapper } from '@/utils/mapperUtils';
import { useEffect, useState } from 'react';

interface InviteUserModalProps {
  initialRoles?: IPage<IRole>;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ initialRoles }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isRoleOpen,
    openModal: openRoleModal,
    closeModal: closeRoleModal,
  } = useModal();

  const [loading, setLoading] = useState<boolean>(false);

  const [userFormData, setUserFormData] = useState<{
    roleId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [roles, setRoles] = useState<{ value: string; label: string }[]>(
    rolesToSingleSelectMapper(initialRoles?.hits) || []
  );

  const handleClose = () => {
    setUserFormData({});
    closeModal();
  };

  const handleRoleSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setRoles(rolesToSingleSelectMapper(initialRoles?.hits) || []);
      return;
    }
    const response = await getRoles(event.target.value);
    if (response.success && response.data?.hits) {
      setRoles(rolesToSingleSelectMapper(response.data.hits));
    }
  };

  const handleRoleSelect = (value: string) => {
    setUserFormData((prev) => ({
      ...prev,
      roleId: value,
    }));
    closeRoleModal();
  };

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const handleInvite = async () => {
    setLoading(true);
    const response = await inviteUser(
      userFormData.firstName || '',
      userFormData.lastName || '',
      userFormData.email || '',
      userFormData.roleId || ''
    );
    if (response.success) {
      handleClose();
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to invite staff',
          variant: 'error',
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <Button onClick={openModal} size='sm'>
        Invite Staff
      </Button>
      {isOpen && (
        <ContainerModal
          title='Invite Staff'
          isOpen={isOpen}
          closeModal={handleClose}
        >
          <br />
          <div className='space-y-4'>
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
            <Input
              type='text'
              placeholder='Enter first name'
              name='firstName'
              value={userFormData.firstName || ''}
              onChange={(e) =>
                setUserFormData({
                  ...userFormData,
                  firstName: e.target.value,
                })
              }
            />
            <Input
              type='text'
              placeholder='Enter last name'
              name='lastName'
              value={userFormData.lastName || ''}
              onChange={(e) =>
                setUserFormData({
                  ...userFormData,
                  lastName: e.target.value,
                })
              }
            />
            <Input
              type='text'
              placeholder='Enter email address'
              name='email'
              value={userFormData.email || ''}
              onChange={(e) =>
                setUserFormData({
                  ...userFormData,
                  email: e.target.value,
                })
              }
            />
            <Input
              type='text'
              placeholder='Search Role'
              name='productTypeId'
              onClick={openRoleModal}
              onChange={() => {}}
              value={userFormData.roleId || ''}
            />
            <div className='flex justify-end space-x-2'>
              <Button onClick={handleInvite} size='sm'>
                Invite {loading ? statusLoader : ''}
              </Button>
            </div>
          </div>
        </ContainerModal>
      )}
      {isRoleOpen && (
        <ContainerModal
          title='Invite Staff'
          isOpen={isOpen}
          closeModal={closeRoleModal}
        >
          <div>
            <Input
              type='text'
              placeholder='Search Role'
              name='productTypeId'
              onChange={handleRoleSearch}
            />
            <ul>
              {roles.map((type) => (
                <li
                  key={type.value}
                  className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                  onClick={() => handleRoleSelect(type.value)}
                >
                  {type.label}
                </li>
              ))}
            </ul>
          </div>
        </ContainerModal>
      )}
    </>
  );
};

export default InviteUserModal;
