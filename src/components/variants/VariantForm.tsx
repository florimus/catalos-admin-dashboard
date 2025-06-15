'use client';

import { FC, useEffect, useState } from 'react';
import Alert from '../ui/alert/Alert';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import {
  IAttributes,
  IProduct,
  IProductType,
  IVariantFormInputs,
} from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import AttributeForm from '../attributes/AttributeForm';
import { AttributeTypes } from '@/core/enums';

interface VariantFormProps {
  productType: IProductType;
  product: IProduct;
}

const VariantForm: FC<VariantFormProps> = ({ productType, product }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const [attributes, setAttributes] = useState<IAttributes>({});

  const [variantFormFields, setVariantFormFields] =
    useState<IVariantFormInputs>({
      id: '',
      name: '',
      slug: '',
      productId: product.id,
      skuId: '',
      medias: [],
      seoTitle: '',
      seoDescription: '',
      attributes: {},
      active: true,
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleProductStatusUpdate = async (active: boolean) => {};

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Variant Term',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: variantFormFields.name,
      placeholder: 'Pro Plus',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid variant term',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'slug',
      label: 'Variant Slug',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          slug: event.target.value,
        }));
      },
      value: variantFormFields.slug,
      placeholder: 'pro-plus',
      id: 'slug',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid variant slug',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'parentId',
      label: 'Parent',
      onChange: () => {},
      value: product.name,
      placeholder: 'pro-plus',
      id: 'slug',
      required: true,
      disabled: true,
      error: false,
      hint: 'Please enter valid variant slug',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'skuId',
      label: 'Variant skuId',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          skuId: event.target.value,
        }));
      },
      value: variantFormFields.skuId,
      placeholder: `${product.skuId}-1`,
      id: 'skuId',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid variant skuId',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'productTypeId',
      label: 'Variant Type',
      onChange: () => {},
      value: productType.name,
      placeholder: 'pro-plus',
      id: 'productTypeId',
      required: true,
      disabled: true,
      error: false,
      hint: 'Please enter valid variant productTypeId',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'seoTitle',
      label: 'Seo Title',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          seoTitle: event.target.value,
        }));
      },
      value: variantFormFields.seoTitle,
      placeholder: `${product.name} | catalos`,
      id: 'seoTitle',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid variant seoTitle',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'seoDescription',
      label: 'Seo Description',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          seoDescription: event.target.value,
        }));
      },
      value: variantFormFields.seoDescription,
      placeholder: 'Pro Plus....',
      id: 'name',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid seoDescription',
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const variantStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : variantFormFields.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: product?.id ? false : true,
    checked: variantFormFields.active || false,
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
              label: 'Save variant',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
              },
            }}
            heading='Variant Form'
            fields={fields}
          />
          {productType.id && (
            <AttributeForm
              title='Attributes'
              productTypeId={productType.id}
              attributes={attributes}
              setAttributes={setAttributes}
              attributeType={AttributeTypes.Variant}
            />
          )}
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Variant Status'
              fields={[variantStatusFields]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VariantForm;
