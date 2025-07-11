'use client';

import { FC, useEffect, useState } from 'react';
import Alert from '../ui/alert/Alert';
import { IBrand, IPage, IProduct, ISearchParams } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import DropzoneComponent from '../form/form-elements/DropZone';
import ImageGallery from '../form/form-elements/ImageGalery';
import { IUploadedImage, uploadImage } from '@/utils/imageUtils';
import { urlToImageMapper } from '@/utils/mapperUtils';
import {
  createBrandAPI,
  updateBrandAPI,
  updateBrandStatusAPI,
} from '@/actions/brand';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import TableCard from '../common/TableCard';
import ProductList from '../products/ProductList';
import SecureComponent from '@/core/authentication/SecureComponent';

interface BrandFormProps {
  brand?: IBrand;
  brandProducts?: IPage<IProduct>;
  searchParams?: ISearchParams | null;
}

const BrandForm: FC<BrandFormProps> = ({
  brand,
  brandProducts,
  searchParams,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const router = useRouter();
  const { start } = useGlobalLoader();

  const [brandFormData, setBrandFormData] = useState<IBrand>({
    id: brand?.id || '',
    name: brand?.name || '',
    avatar: brand?.avatar || '',
    seoTitle: brand?.seoTitle || '',
    seoDescription: brand?.seoDescription || '',
    active: brand?.active || false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleSave = async () => {
    setLoading(true);
    const method = brand?.id ? updateBrandAPI : createBrandAPI;
    const response = await method({
      ...brandFormData,
    });
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Brand saved successfully'
            : 'Failed to save brand'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (!brand?.id && response.success) {
      start(() => router.push(`/brands/${response.data?.id}`));
    }
  };

  const handleCategoryStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await updateBrandStatusAPI(brand?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message: response.message || 'Brand status updated successfully',
          variant: 'success',
        },
      ]);
      setBrandFormData((prev) => ({
        ...prev,
        active,
      }));
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to update brand status',
          variant: 'error',
        },
      ]);
    }
  };

  const handleImageDrop = async (files: File[]) => {
    setImageUploading(true);
    const uploadedImage: IUploadedImage = await uploadImage(files?.[0]);
    setBrandFormData((prev) => ({
      ...prev,
      avatar: uploadedImage.url,
    }));
    setImageUploading(false);
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Brand Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBrandFormData((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: brandFormData.name,
      placeholder: 'Hummi Kola',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid brand name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'seoTitle',
      label: 'SEO Title',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBrandFormData((prev) => ({
          ...prev,
          seoTitle: event.target.value,
        }));
      },
      value: brandFormData.seoTitle,
      placeholder: 'An awesome brand',
      id: 'seoTitle',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid SEO Title',
    },
    {
      fieldType: FormFieldType.TextArea,
      name: 'seoDescription',
      label: 'SEO Description',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setBrandFormData((prev) => ({
          ...prev,
          seoDescription: event.target.value,
        }));
      },
      value: brandFormData.seoDescription,
      placeholder: 'An awesome brand',
      id: 'seoDescription',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid SEO Description',
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const categoryStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : brandFormData.active
      ? 'Online'
      : 'Offline',
    name: 'brand-status',
    disabled: brand?.id ? false : true,
    checked: brandFormData.active || false,
    onChange: (checked: boolean) => handleCategoryStatusUpdate(checked),
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
          <div>
            <DefaultInputs
              cta={{
                permission: 'BRD:NN',
                label: 'Save Brand',
                loading: loading,
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleSave();
                },
              }}
              heading='Brand Form'
              fields={fields}
            />
          </div>
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Brand Status'
              fields={[categoryStatusFields]}
            />
            <SecureComponent permission='BRD:NN'>
              <DropzoneComponent
                loading={imageUploading}
                onDrop={handleImageDrop}
              />
            </SecureComponent>
            <ImageGallery
              images={
                brandFormData.avatar
                  ? [urlToImageMapper(brandFormData.avatar, '')]
                  : []
              }
              showOverlay={false}
            />
          </div>
        </div>
      </div>
      {brand?.id && (
        <SecureComponent permission='PRD:LS'>
          <TableCard
            searchPlaceHolder={'Search products...'}
            searchParams={searchParams || {}}
          >
            <ProductList {...brandProducts} />
          </TableCard>
        </SecureComponent>
      )}
    </>
  );
};

export default BrandForm;
