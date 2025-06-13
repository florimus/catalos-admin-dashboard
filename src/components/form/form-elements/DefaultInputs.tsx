'use client';
import React, { FC } from 'react';
import FormCard from '@/components/common/FormCard';
import {
  FormFields,
  FormFieldType,
  IMultiSelectFormFieldProps,
  ITextFormFieldProps,
} from './DefaultFormFields';

interface IDefaultInputsProps {
  heading?: string;
  cta?: {
    label: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  };
  fields?: unknown;
}

const DefaultInputs: FC<IDefaultInputsProps> = ({ heading, cta }) => {
  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Enter product name',
      onchange: (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
      },
      value: '',
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
      onchange: (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
      },
      value: '',
      placeholder: 'SKU00000',
      id: 'skuId',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid skuId',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'productTypeId',
      label: 'Enter Product Type',
      onchange: (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
      },
      value: '',
      placeholder: 'Cabaras',
      id: 'productTypeId',
      required: true,
      disabled: true,
      error: false,
      hint: 'Please enter valid product type',
    },
    {
      fieldType: FormFieldType.MultiSelect,
      name: 'publishedChannels',
      label: 'Select Published Channels',
      options: [
        {
          value: 'channel 1',
          text: 'channel_1',
          selected: true,
        },
        {
          value: 'channel 2',
          text: 'channel_2',
          selected: true,
        },
      ],
      defaultSelected: [],
      onchange: (selected: string[]) => {
        console.log(selected);
      },
    },
  ];
  return (
    <FormCard
      title={heading || 'Default Inputs'}
      ctaLabel={cta?.label}
      onSubmit={cta?.onSubmit}
    >
      {Array.isArray(fields) &&
        fields.map((field) => {
          return field.fieldType === FormFieldType.Text ? (
            <FormFields.TextFormField
              key={field.name}
              {...(field as unknown as ITextFormFieldProps)}
            />
          ) : field.fieldType === FormFieldType.MultiSelect ? (
            <FormFields.MultiSelectFormField
              key={field.name}
              {...(field as unknown as IMultiSelectFormFieldProps)}
            />
          ) : null;
        })}
    </FormCard>
  );
};

export default DefaultInputs;
