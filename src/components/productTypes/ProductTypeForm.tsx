'use client';

import {
  IAttributeListItem,
  IAttributes,
  IProductType,
  IProductTypeFormInputs,
} from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useEffect, useState } from 'react';

import Alert from '../ui/alert/Alert';
import { useRouter } from 'next/navigation';
import AttributeCreateForm from '../attributes/AttributeFreateForm';
import {
  attributeListToMapper,
  attributesToAttributeListMapper,
} from '@/utils/mapperUtils';
import { formatSlug } from '@/utils/stringUtils';
import {
  createProductTypeAPI,
  updateProductTypeAPI,
  updateProductTypeStatusAPI,
} from '@/actions/product-type';

interface ProductTypeFormProps {
  productType?: IProductType;
}

const ProductTypeForm: FC<ProductTypeFormProps> = ({ productType }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const router = useRouter();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const [createProductTypeForm, setCreateProductTypeForm] =
    useState<IProductTypeFormInputs>({
      id: productType?.id || '',
      name: productType?.name || '',
      slug: productType?.slug || '',
      active: productType?.active || false,
      productAttributes: productType?.productAttributes || {},
      variantAttributes: productType?.variantAttributes || {},
    });
  const [allAttributes, setAllAttributes] = useState<IAttributeListItem[]>(
    attributesToAttributeListMapper(productType?.productAttributes || {}) || []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleSave = async () => {
    setLoading(true);
    const productAttributes: IAttributes = attributeListToMapper(allAttributes);
    console.log({ ...createProductTypeForm, productAttributes });

    const method = productType?.id
      ? updateProductTypeAPI
      : createProductTypeAPI;
    const response = await method({
      ...createProductTypeForm,
      id: productType?.id || '',
      productAttributes: productAttributes,
    });
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Product saved successfully'
            : 'Failed to save product'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (!productType?.id && response.success) {
      router.push(`/product-types/${response.data?.id}`);
    }
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await updateProductTypeStatusAPI(
      productType?.id || '',
      active
    );
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message:
            response.message || 'Product type status updated successfully',
          variant: 'success',
        },
      ]);
      setCreateProductTypeForm((prev) => ({
        ...prev,
        active,
      }));
    }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Product type Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateProductTypeForm((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: createProductTypeForm.name,
      placeholder: 'Lucci vasqqi...',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid product name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'slug',
      label: 'Product type Slug',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateProductTypeForm((prev) => ({
          ...prev,
          slug: formatSlug(event.target.value),
        }));
      },
      value: createProductTypeForm.slug,
      placeholder: 'lucci-vasqqi',
      id: 'slug',
      required: true,
      disabled: productType?.id ? true : false,
      error: false,
      hint: 'Please enter valid slug',
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const productTypeStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : createProductTypeForm.active
      ? 'Online'
      : 'Offline',
    name: 'product-type-status',
    disabled: productType?.id ? false : true,
    checked: createProductTypeForm.active || false,
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
            cta={{
              label: 'Save Product Type',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Product Type Form'
            fields={fields}
          />
          <AttributeCreateForm
            allAttributes={allAttributes}
            setAllAttributes={setAllAttributes}
          />
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Product Type Status'
              fields={[productTypeStatusFields]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTypeForm;
