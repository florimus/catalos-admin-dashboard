import React, { FC, useState } from 'react';
import FormCard from '@/components/common/FormCard';
import Switch from '@/components/form/switch/Switch';
import { ChevronDownIcon, ChevronLeftIcon } from '@/icons';
import { IRolePermissionItem } from '@/core/types';
import { AllModules, AllPermissions } from '@/core/constants';

interface IPermissionEditorProps {
  roleFormData: IRolePermissionItem;
  disabled: boolean;
  setRoleFormData: React.Dispatch<React.SetStateAction<IRolePermissionItem>>;
}

const PermissionEditor: FC<IPermissionEditorProps> = ({
  roleFormData,
  disabled,
  setRoleFormData,
}) => {
  const [expandedModules, setExpandedModules] = useState(
    AllModules.map(() => false)
  );

  const toggleOpen = (moduleIndex: number) => {
    const updatedExpandedModules = [...expandedModules];
    updatedExpandedModules[moduleIndex] = !updatedExpandedModules[moduleIndex];
    setExpandedModules(updatedExpandedModules);
  };

  const handleToggleModulePermission = (
    enable: boolean,
    module: string,
    permission: string
  ) => {
    const currentModulePermissions = roleFormData?.[module] || [];
    if (enable && !currentModulePermissions.includes(permission)) {
      setRoleFormData((prevFormData) => ({
        ...prevFormData,
        [module]: [...(prevFormData?.[module] || []), permission],
      }));
    } else {
      setRoleFormData((prevFormData) => ({
        ...prevFormData,
        [module]: (prevFormData?.[module] || []).filter(
          (p) => p !== permission
        ),
      }));
    }
  };

  return (
    <FormCard title={'Roles and Permissions'}>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {AllModules.map((module, index) => (
          <div
            key={module}
            className='p-6 border rounded-md dark:border-gray-700 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          >
            <div
              className='flex justify-between items-center cursor-pointer'
              onClick={() => toggleOpen(index)}
            >
              <p className='text-gray-700 dark:text-gray-300 font-medium'>
                {module}
              </p>
              <span className='flex items-center text-gray-500 dark:text-gray-500 font-medium'>
                {`${roleFormData?.[module]?.length || 0} / 3`}{' '}
                {expandedModules[index] ? (
                  <ChevronDownIcon className='text-gray-700 dark:text-gray-300' />
                ) : (
                  <ChevronLeftIcon className='rotate-180 text-gray-700 dark:text-gray-300' />
                )}
              </span>
            </div>
            {expandedModules[index] && (
              <div className='mt-8'>
                <div className='space-y-2'>
                  {AllPermissions.map((permissionType) => (
                    <div
                      key={`key_${module}_${permissionType}`}
                      className='flex items-center space-x-2'
                    >
                      <Switch
                        label={permissionType}
                        disabled={disabled}
                        defaultChecked={roleFormData?.[module]?.includes(
                          permissionType
                        )}
                        onChange={(enable: boolean) =>
                          handleToggleModulePermission(
                            enable,
                            module,
                            permissionType
                          )
                        }
                        color='blue'
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </FormCard>
  );
};

export default PermissionEditor;
