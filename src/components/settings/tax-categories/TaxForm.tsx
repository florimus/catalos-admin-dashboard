'use client';

import { ITax } from '@/core/types';
import { FC, useEffect, useState } from 'react';

import { FormFieldType } from '@/components/form/form-elements/DefaultFormFields';
import Alert from '@/components/ui/alert/Alert';
import DefaultInputs from '@/components/form/form-elements/DefaultInputs';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import {
  createTaxAPI,
  updateTaxById,
  updateTaxStatusById,
} from '@/actions/tax';

interface TaxFormProps {
  tax?: ITax;
}

const TaxForm: FC<TaxFormProps> = ({ tax }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const router = useRouter();
  const { start } = useGlobalLoader();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [taxFormData, setTaxFormData] = useState<ITax>({
    id: tax?.id || '',
    name: tax?.name || '',
    rate: tax?.rate || 0,
    active: tax?.active || false,
    fixed: tax?.fixed || false,
    applicableChannels: tax?.applicableChannels || [],
  });

  const handleSave = async () => {
    setLoading(true);
    const method = tax?.id ? updateTaxById : createTaxAPI;
    const response = await method(taxFormData);
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success ? 'Tax saved successfully' : 'Failed to save Tax'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (!tax?.id && response.success) {
      start(() => router.push(`/settings/tax-categories/${response.data?.id}`));
    }
  };

  const handleRoleStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await updateTaxStatusById(tax?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message: response.message || 'Tax status updated successfully',
          variant: 'success',
        },
      ]);
      setTaxFormData((prev) => ({
        ...prev,
        active,
      }));
    } else {
      setAlerts([
        {
          message: response.message || 'Failed to update role Tax',
          variant: 'error',
        },
      ]);
    }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaxFormData((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: taxFormData.name,
      placeholder: 'Locci nutter',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'rate',
      label: `Tax rate ${taxFormData.fixed ? '' : ' (%)'}`,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaxFormData((prev) => ({
          ...prev,
          rate: parseFloat(event.target.value || '0'),
        }));
      },
      value: taxFormData.rate,
      placeholder: 'Locci nutter',
      id: 'rate',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid rate',
    },
    {
      fieldType: FormFieldType.Switch,
      label: taxFormData.fixed ? 'Fixed Rate' : 'Percentage Rate',
      name: 'product-status',
      disabled: false,
      checked: taxFormData.fixed || false,
      onChange: (checked: boolean) =>
        setTaxFormData((prev) => ({
          ...prev,
          fixed: checked,
        })),
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const roleStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : taxFormData.active
      ? 'Online'
      : 'Offline',
    name: 'tax-status',
    disabled: !tax?.id ? true : false,
    checked: taxFormData.active || false,
    onChange: (checked: boolean) => handleRoleStatusUpdate(checked),
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
              permission: 'TAX:NN',
              label: 'Save Changes',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Tax Form'
            fields={fields}
          />
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Tax Category Status'
              fields={[roleStatusFields]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxForm;
