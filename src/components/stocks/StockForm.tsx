'use client';

import { IStock, IStockInfo } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import GridFormInputs from '../form/form-elements/GridFormInputs';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { CHANNELS } from '@/core/constants';

interface IStockFormProps {
  stockInfo: IStock | undefined;
}

const StockForm: FC<IStockFormProps> = ({ stockInfo }) => {
  const [stockData, setStockData] = useState<IStockInfo>(
    stockInfo?.stockInfo || {}
  );

  const handleStockInfoChange = useCallback(
    (channel: string, name: string, value: string) => {
      setStockData((prev) => {
        return {
          ...prev,
          [channel]: {
            ...prev?.[channel],
            [name]: value,
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

  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
      <div className='grid col-span-1 xl:col-span-2'>
        <GridFormInputs
          heading='Stocks Details'
          gridFields={[...createStockGridForm()]}
        />
      </div>
    </div>
  );
};

export default StockForm;
