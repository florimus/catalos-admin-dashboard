'use client';

import { IProductCreateFormInputs } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { useState } from 'react';
import { channelToMultiSelectMapper } from '@/utils/mapperUtils';
import { CHANNELS } from '@/core/constants';

const CreateProductForm = () => {
  const [createProductForm, setCreateProductForm] =
    useState<IProductCreateFormInputs>({
      name: '',
      skuId: '',
      productTypeId: '',
      publishedChannels: [],
    });

  const handleSave = () => {
    console.log('Form submitted', createProductForm);
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Enter product name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateProductForm((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: createProductForm.name,
      placeholder: 'Lucci vasqqi...',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid product name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'skuId',
      label: 'Enter Sku Id',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateProductForm((prev) => ({
          ...prev,
          skuId: event.target.value,
        }));
      },
      value: createProductForm.skuId,
      placeholder: 'SKU00000',
      id: 'skuId',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid skuId',
    },
    {
      fieldType: FormFieldType.MultiSelect,
      name: 'publishedChannels',
      label: 'Select Published Channels',
      options: channelToMultiSelectMapper(CHANNELS),
      defaultSelected: createProductForm.publishedChannels,
      onChange: (selected: string[]) => {
        setCreateProductForm((prev) => ({
          ...prev,
          publishedChannels: selected,
        }));
      },
    },
    {
      fieldType: FormFieldType.DropDown,
      name: 'productTypeId',
      label: 'Select Product Type',
      required: true,
      disabled: false,
      onChange: (value: string) => {
        setCreateProductForm((prev) => ({
          ...prev,
          productTypeId: value,
        }));
      },
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'furniture', label: 'Furniture' },
      ],
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
      <div className='grid col-span-1 xl:col-span-2'>
        <DefaultInputs
          cta={{
            label: 'Save Product',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSave();
            },
          }}
          heading='Product Form'
          fields={fields}
        />
      </div>
    </div>
  );
};

export default CreateProductForm;
