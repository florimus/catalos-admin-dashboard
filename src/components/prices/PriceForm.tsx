'use client';

import { IPrice, IPriceInfo, IResponse } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import GridFormInputs from '../form/form-elements/GridFormInputs';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { CHANNELS } from '@/core/constants';
import Alert from '../ui/alert/Alert';
import { updatePrice } from '@/actions/price';

interface IPriceFormProps {
  priceInfo: IPrice | undefined;
  skuId: string;
}

const PriceForm: FC<IPriceFormProps> = ({ priceInfo, skuId }) => {
  const [priceData, setPriceData] = useState<IPriceInfo>(
    priceInfo?.priceInfo || {}
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handlePriceInfoChange = useCallback(
    (channel: string, name: string, value: string) => {
      setPriceData((prev) => {
        return {
          ...prev,
          [channel]: {
            ...prev?.[channel],
            taxClasses: prev?.[channel]?.taxClasses || [], //TODO: implement tax class !
            salesPrice: Number(prev?.[channel]?.salesPrice || 0),
            [name]: Number(value),
          },
        };
      });
    },
    []
  );

  const createPriceGridForm = useCallback(() => {
    const priceInfo = priceData || {};
    return (
      CHANNELS.map((channel) => {
        const salesPrice = priceInfo[channel.id]?.salesPrice || 0;
        return [
          {
            fieldType: FormFieldType.Display,
            name: 'channel',
            label: 'Channel',
            onChange: () => {},
            value: channel?.name,
            placeholder: 'channel',
            id: 'channel',
            required: true,
            disabled: true,
          },
          {
            fieldType: FormFieldType.Text,
            name: 'salesPrice',
            label: 'Sales Price',
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              handlePriceInfoChange(channel.id, e.target.name, e.target.value);
            },
            value: salesPrice.toString(),
            placeholder: '100',
            id: 'salesPrice',
            required: true,
            disabled: false,
          },
        ];
      }) || []
    );
  }, [handlePriceInfoChange, priceData]);

  const handleSaveStock = async () => {
    setLoading(true);
    const response: IResponse<IPrice> = await updatePrice({
      skuId,
      priceInfo: priceData,
    });
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Price details saved successfully'
            : 'Failed to save Price details'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    setLoading(false);
  };

  return (
    <>
      {Array.isArray(alerts) &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <div className='mb-5' key={alert.message}>
            <Alert
              message=''
              variant={
                alert.variant as 'success' | 'error' | 'warning' | 'info'
              }
              title={alert.message}
            />
          </div>
        ))}
      <GridFormInputs
        heading='Price Details'
        cta={{
          label: 'Save',
          onSubmit: handleSaveStock,
          loading: loading,
        }}
        gridFields={[...createPriceGridForm()]}
      />
    </>
  );
};

export default PriceForm;
