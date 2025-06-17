'use client';

import { IResponse, IStock, IStockInfo } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import GridFormInputs from '../form/form-elements/GridFormInputs';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { CHANNELS } from '@/core/constants';
import { updateStockAPI } from '@/actions/stock';
import Alert from '../ui/alert/Alert';

interface IStockFormProps {
  stockInfo: IStock | undefined;
  variantId: string;
}

const StockForm: FC<IStockFormProps> = ({ stockInfo, variantId }) => {
  const [stockData, setStockData] = useState<IStockInfo>(
    stockInfo?.stockInfo || {}
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

  const handleStockInfoChange = useCallback(
    (channel: string, name: string, value: string) => {
      setStockData((prev) => {
        return {
          ...prev,
          [channel]: {
            reservedStocks: Number(prev?.[channel]?.reservedStocks || 0),
            safetyStocks: Number(prev?.[channel]?.safetyStocks || 0),
            totalStocks: Number(prev?.[channel]?.totalStocks || 0),
            [name]: Number(value),
          },
        };
      });
    },
    []
  );

  const createStockGridForm = useCallback(() => {
    const stockInfo = stockData || {};
    return (
      CHANNELS.map((channel) => {
        const reservedStocks = stockInfo[channel.id]?.reservedStocks || 0;
        const safetyStocks = stockInfo[channel.id]?.safetyStocks || 0;
        const totalStocks = stockInfo[channel.id]?.totalStocks || 0;
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
            fieldType: FormFieldType.Display,
            name: 'reservedStocks',
            label: 'Reserved Stocks',
            onChange: () => {},
            value: reservedStocks.toString(),
            placeholder: '100',
            id: 'availableStocks',
            required: true,
            disabled: true,
          },
          {
            fieldType: FormFieldType.Text,
            name: 'safetyStocks',
            label: 'Safety Stocks',
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              handleStockInfoChange(channel.id, e.target.name, e.target.value);
            },
            value: safetyStocks.toString(),
            placeholder: '100',
            id: 'safetyStocks',
            required: false,
            disabled: false,
          },
          {
            fieldType: FormFieldType.Text,
            name: 'totalStocks',
            label: 'Total Stocks',
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              handleStockInfoChange(channel.id, e.target.name, e.target.value);
            },
            value: totalStocks.toString(),
            placeholder: '100',
            id: 'totalStocks',
            required: true,
            disabled: false,
          },
        ];
      }) || []
    );
  }, [stockData, handleStockInfoChange]);

  const handleSaveStock = async () => {
    setLoading(true);
    const response: IResponse<IStock> = await updateStockAPI({
      ...stockInfo,
      stockInfo: stockData,
      variantId: variantId,
    });
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Variant saved successfully'
            : 'Failed to save Variant'),
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
        heading='Stocks Details'
        cta={{
          label: 'Save',
          onSubmit: handleSaveStock,
          loading: loading,
        }}
        gridFields={[...createStockGridForm()]}
      />
    </>
  );
};

export default StockForm;
