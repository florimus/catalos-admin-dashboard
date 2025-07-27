'use client';

import { FC, useEffect, useState } from 'react';
import Alert from '../ui/alert/Alert';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { ITranslation } from '@/core/types';
import { upsertTranslation } from '@/actions/translation';

interface TranslationFormProps {
  permission: string;
  uniqueId: string;
  languageOptions: {
    value: string;
    label: string;
  }[];
  pageTranslationsFields: string[];
  selectedLanguage: string;
  attributeFields?: string[];
  translations?: ITranslation;
}

const TranslationForm: FC<TranslationFormProps> = ({
  permission,
  uniqueId,
  attributeFields,
  pageTranslationsFields,
  translations,
  languageOptions,
  selectedLanguage,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [productTranslations, setProductTranslations] = useState<
    Record<string, string>
  >(translations?.translations || {});

  const [translationState] = useState<{
    active: boolean;
  }>({
    active: translations?.active || false,
  });

  const translationFields = [
    ...pageTranslationsFields,
    ...(attributeFields || []),
  ].map((field) => {
    return {
      fieldType:
        productTranslations?.[field]?.length > 100
          ? FormFieldType.TextArea
          : FormFieldType.Text,
      name: field,
      label: `Enter ${field}`,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductTranslations((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
      value: productTranslations?.[field] || '',
      placeholder: 'Translation',
      id: `translation-${field}`,
      required: false,
      disabled: false,
    };
  });

  const handleSave = async () => {
    setLoading(true);
    const response = await upsertTranslation({
      ...translations,
      uniqueId,
      languageCode: selectedLanguage,
      translations: productTranslations,
    } as ITranslation);
    if (response.success) {
      setAlerts([
        {
          message:
            response.message ||
            (response.success
              ? 'Translation saved successfully'
              : 'Failed to save Translation details'),
          variant: response.success ? 'success' : 'error',
        },
      ]);
      setLoading(false);
    } else {
      setAlerts([
        {
          message:
            response.message ||
            (response.success
              ? 'Translation saved successfully'
              : 'Failed to save Translation details'),
          variant: response.success ? 'success' : 'error',
        },
      ]);
      setLoading(false);
    }
  };

  const handleProductStatusUpdate = async () => {};

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const translationStatusField = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : translationState?.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: false,
    checked: translationState?.active || false,
    onChange: () => handleProductStatusUpdate(),
  };

  const translationLanguageField = {
    fieldType: FormFieldType.DropDown,
    name: 'translation-Language',
    onChange: () => {},
    options: languageOptions,
    defaultValue: selectedLanguage,
    placeholder: 'Select Language',
    disabled: false,
    id: 'translation-language',
    required: true,
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
              permission,
              label: 'Save Translation',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Translation Form'
            fields={translationFields}
          />
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Translation Language'
              fields={[translationLanguageField]}
            />
            <DefaultInputs
              heading='Translation Status'
              fields={[translationStatusField]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationForm;
