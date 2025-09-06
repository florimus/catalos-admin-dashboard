'use client';
import React, { FC, useMemo } from 'react';
import FormCard from '@/components/common/FormCard';
import {
  FormFields,
  ITextAreaFormFieldProps,
  FormFieldType,
  IDisplayFieldProps,
  IDropDownFormFieldProps,
  IMultiSelectFormFieldProps,
  ISwitchFieldProps,
  ITextFormFieldProps,
  IDatePickerFormFieldProps,
} from './DefaultFormFields';

interface IDefaultInputsProps {
  heading?: string;
  cta?: {
    label: string;
    loading?: boolean;
    permission?: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  };
  custom?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: any[];
}

const DefaultInputs: FC<IDefaultInputsProps> = ({
  heading,
  cta,
  custom,
  fields,
}) =>
  useMemo(() => {
    return (
      <FormCard
        title={heading || 'Default Inputs'}
        custom={custom}
        ctaLabel={cta?.label}
        loading={cta?.loading}
        onSubmit={cta?.onSubmit}
        permission={cta?.permission}
      >
        {Array.isArray(fields) &&
          fields.map((field) => {
            return field.fieldType === FormFieldType.Text ? (
              <FormFields.TextFormField
                key={field.name}
                {...(field as unknown as ITextFormFieldProps)}
              />
            ) : field.fieldType === FormFieldType.TextArea ? (
              <FormFields.TextAreaFormField
                key={field.name}
                {...(field as unknown as ITextAreaFormFieldProps)}
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
            ) : field.fieldType === FormFieldType.Display ? (
              <FormFields.DisplayField
                key={field.name}
                {...(field as unknown as IDisplayFieldProps)}
              />
            ) : field.fieldType === FormFieldType.DatePicker ? (
              <FormFields.DatePickerFormField
                key={field.name}
                {...(field as unknown as IDatePickerFormFieldProps)}
              />
            ) : field.fieldType === FormFieldType.Switch ? (
              <FormFields.SwitchField
                key={field.name}
                {...(field as unknown as ISwitchFieldProps)}
              />
            ) : null;
          })}
      </FormCard>
    );
  }, [
    cta?.label,
    cta?.loading,
    cta?.onSubmit,
    cta?.permission,
    custom,
    fields,
    heading,
  ]);

export default DefaultInputs;
