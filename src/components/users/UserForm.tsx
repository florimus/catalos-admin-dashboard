'use client';

import { ICustomerInfo } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useEffect, useState } from 'react';

import Alert from '../ui/alert/Alert';
import { updateStaffUserInfo, userStatusUpdateApi } from '@/actions/user';
import DropzoneComponent from '../form/form-elements/DropZone';
import { IUploadedImage, uploadImage } from '@/utils/imageUtils';
import ImageGallery from '../form/form-elements/ImageGalery';
import { urlToImageMapper } from '@/utils/mapperUtils';
// import { useRouter } from 'next/navigation';
// import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface UserFormProps {
  customer?: ICustomerInfo;
  disableEdits?: boolean;
}

const UserForm: FC<UserFormProps> = ({ customer, disableEdits = false }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  // const router = useRouter();
  // const { start } = useGlobalLoader();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [userFormData, setUserFormData] = useState<ICustomerInfo>({
    id: customer?.id || '',
    userGroupId: customer?.userGroupId || '',
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    avatar: customer?.avatar || '',
    grandType: customer?.grandType || '',
    roleId: customer?.roleId || '',
    verified: customer?.verified || false,
    active: customer?.active || false,
  });

  const handleSave = async () => {
    setLoading(true);
    const method = updateStaffUserInfo;
    const response = await method(userFormData);
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Staff ifo saved successfully'
            : 'Failed to save Staff'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    // if (!customer?.id && response.success) {
    //   start(() => router.push(`/products/${response.data?.id}`));
    // }
  };

  const handleImageDrop = async (files: File[]) => {
    setImageUploading(true);
    const uploadedImages: IUploadedImage = await uploadImage(files?.[0]);
    setUserFormData((prev) => ({
      ...prev,
      avatar: uploadedImages.url,
    }));
    setImageUploading(false);
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await userStatusUpdateApi(customer?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message: response.message || 'Customer status updated successfully',
          variant: 'success',
        },
      ]);
      setUserFormData((prev) => ({
        ...prev,
        active,
      }));
    }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'firstName',
      label: 'First Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData((prev) => ({
          ...prev,
          firstName: event.target.value,
        }));
      },
      value: userFormData.firstName,
      placeholder: 'Lucci vasqqi...',
      id: 'firstName',
      required: true,
      disabled: disableEdits,
      error: false,
      hint: 'Please enter valid firstName',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'lastName',
      label: 'Last Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData((prev) => ({
          ...prev,
          lastName: event.target.value,
        }));
      },
      value: userFormData.lastName,
      placeholder: 'Lucci vasqqi...',
      id: 'lastName',
      required: false,
      disabled: disableEdits,
      error: false,
      hint: 'Please enter valid lastName',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'email',
      label: 'Email',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData((prev) => ({
          ...prev,
          email: event.target.value,
        }));
      },
      value: userFormData.email,
      placeholder: 'licci@catalos.com',
      id: 'email',
      required: false,
      disabled: true,
      error: false,
      hint: 'Please enter valid email',
    },
    {
      fieldType: FormFieldType.Display,
      name: 'roleId',
      label: 'Customer Role',
      required: true,
      disabled: disableEdits,
      value: userFormData.roleId,
      id: 'roleId',
    },
    {
      fieldType: FormFieldType.Display,
      name: 'userGroupId',
      label: 'Customer Group',
      required: false,
      disabled: disableEdits,
      placeholder: 'Unassigned',
      value: userFormData.userGroupId,
      id: 'userGroupId',
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const productStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : userFormData.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: customer?.id ? false : true,
    checked: userFormData.active || false,
    onChange: (checked: boolean) => handleProductStatusUpdate(checked),
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
            cta={
              disableEdits
                ? undefined
                : {
                    label: 'Save Changes',
                    loading: loading,
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      handleSave();
                    },
                  }
            }
            heading='Customer Form'
            fields={fields}
          />
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Customer Status'
              fields={[productStatusFields]}
            />
            {!disableEdits && (
              <>
                <DropzoneComponent
                  loading={imageUploading}
                  onDrop={handleImageDrop}
                />
                <ImageGallery
                  images={
                    userFormData.avatar
                      ? [urlToImageMapper(userFormData.avatar, '')]
                      : []
                  }
                  showOverlay={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForm;
