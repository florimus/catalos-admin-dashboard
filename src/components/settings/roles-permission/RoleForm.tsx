'use client';

import { IRole, IRolePermissionItem } from '@/core/types';
import { FC, useEffect, useState } from 'react';

import { FormFieldType } from '@/components/form/form-elements/DefaultFormFields';
import Alert from '@/components/ui/alert/Alert';
import DefaultInputs from '@/components/form/form-elements/DefaultInputs';
import { formatSlug } from '@/utils/stringUtils';
import PermissionEditor from './editor/PermissionEditor';
import { createRoleAPI, updateRoleByUniqueId } from '@/actions/role';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface RoleFormProps {
  role?: IRole;
}

const RoleForm: FC<RoleFormProps> = ({ role }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const router = useRouter();
  const { start } = useGlobalLoader();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [roleFormData, setRoleFormData] = useState<IRole>({
    id: role?.id || '',
    uniqueId: role?.uniqueId || '',
    name: role?.name || '',
    description: role?.description || '',
    default: role?.default || false,
    permissionList: role?.permissionList || {},
    active: role?.active || false,
  });

  const [permissionList, setPermissionList] = useState<IRolePermissionItem>(
    role?.permissionList || {}
  );

  const handleSave = async () => {
    setLoading(true);
    const method = role?.id ? updateRoleByUniqueId : createRoleAPI;
    const response = await method({
      ...roleFormData,
      permissionList: validateAndFormatPermissionList(permissionList),
    });
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Role saved successfully'
            : 'Failed to save Role'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (!role?.id && response.success) {
      start(() =>
        router.push(
          `/settings/roles-and-permissions/${response.data?.uniqueId}`
        )
      );
    }
  };

  const validateAndFormatPermissionList = (list: IRolePermissionItem) => {
    const permissionList: IRolePermissionItem = {};
    Object.keys(list).forEach((key) => {
      if (list[key] && list[key].length > 0) {
        permissionList[key] = list[key];
      }
    });
    return permissionList;
  };

  const handleRoleStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    // const response = await userStatusUpdateApi(role?.id || '', active);
    // setStatusLoading(false);
    // if (response.success) {
    //   setAlerts([
    //     {
    //       message: response.message || 'Customer status updated successfully',
    //       variant: 'success',
    //     },
    //   ]);
    //   setRoleFormData((prev) => ({
    //     ...prev,
    //     active,
    //   }));
    // }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'uniqueId',
      label: 'Unique ID',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleFormData((prev) => ({
          ...prev,
          uniqueId: formatSlug(event.target.value),
        }));
      },
      value: roleFormData.uniqueId,
      placeholder: 'Unique ID',
      id: 'uniqueId',
      required: true,
      disabled: role?.id || role?.default ? true : false,
      error: false,
      hint: 'Please enter valid uniqueId',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Role name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleFormData((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: roleFormData.name,
      placeholder: 'Locci nutter',
      id: 'lastName',
      required: false,
      disabled: role?.default ? true : false,
      error: false,
      hint: 'Please enter valid name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'description',
      label: 'Description',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleFormData((prev) => ({
          ...prev,
          description: event.target.value,
        }));
      },
      value: roleFormData.description,
      placeholder: 'This is a description',
      id: 'description',
      required: false,
      disabled: role?.default ? true : false,
      error: false,
      hint: 'Please enter valid description',
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const productStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : roleFormData.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: role?.id ? false : true,
    checked: roleFormData.active || false,
    onChange: (checked: boolean) => handleRoleStatusUpdate(checked),
  };

  return (
    <>
      {Array.isArray(alerts) &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <Alert
            key={alert.message}
            message=''
            variant={alert.variant as 'success' | 'error' | 'warning' | 'info'}
            title={alert.message}
          />
        ))}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3 my-6'>
        <div className='grid col-span-1 xl:col-span-2'>
          <DefaultInputs
            cta={{
              label: 'Save Changes',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Customer Form'
            fields={fields}
          />
          <PermissionEditor
            roleFormData={permissionList}
            setRoleFormData={setPermissionList}
            disabled={role?.default || false}
          />
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Customer Status'
              fields={[productStatusFields]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleForm;
