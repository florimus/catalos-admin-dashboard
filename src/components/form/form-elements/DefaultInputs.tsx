'use client';
import React, { FC } from 'react';
import FormCard from '@/components/common/FormCard';
import {
  FormFields,
  FormFieldType,
  IDropDownFormFieldProps,
  IMultiSelectFormFieldProps,
  ITextFormFieldProps,
} from './DefaultFormFields';

interface IDefaultInputsProps {
  heading?: string;
  cta?: {
    label: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
}

const DefaultInputs: FC<IDefaultInputsProps> = ({ heading, cta, fields }) => {
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
          ) : field.fieldType === FormFieldType.DropDown ? (
            <FormFields.DropDownFormField
              key={field.name}
              {...(field as unknown as IDropDownFormFieldProps)}
            />
          ) : (
            <div key={field.name}>
              Unsupported field type: {field.fieldType}
            </div>
          );
        })}
    </FormCard>
  );
};

export default DefaultInputs;
