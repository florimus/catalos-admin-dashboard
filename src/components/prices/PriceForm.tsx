'use client';

import { IPage, IPrice, IPriceInfo, IResponse, ITax } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import GridFormInputs from '../form/form-elements/GridFormInputs';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { CHANNELS } from '@/core/constants';
import Alert from '../ui/alert/Alert';
import { updatePrice } from '@/actions/price';
import { useModal } from '@/hooks/useModal';
import FormInModal from '../modals/FormInModal';
import Input from '../form/input/InputField';
import { getTaxes } from '@/actions/tax';
import { taxesToSingleSelectMapper } from '@/utils/mapperUtils';

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

  const [taxClasses, setTaxClasses] = useState<
    { value: string; label: string }[]
  >([]);

  const [
    selectedChannelForTaxClassSearch,
    setSelectedChannelForTaxClassSearch,
  ] = useState<string>('');

  const { isOpen, openModal, closeModal } = useModal();

  const openTaxClassSearchModal = useCallback(
    async (channel: string) => {
      setSelectedChannelForTaxClassSearch(channel);
      const response: IResponse<IPage<ITax>> = await getTaxes(
        '',
        0,
        10,
        channel
      );
      if (response.success && response.data?.hits) {
        setTaxClasses(taxesToSingleSelectMapper(response.data.hits));
      }
      openModal();
    },
    [openModal]
  );

  const handleTaxClassSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === '') {
      setTaxClasses([]);
      return;
    }
    const response: IResponse<IPage<ITax>> = await getTaxes(
      event.target.value,
      0,
      10,
      selectedChannelForTaxClassSearch
    );
    if (response.success && response.data?.hits) {
      setTaxClasses(taxesToSingleSelectMapper(response.data.hits));
    }
  };

  const handleTacClassSelect = (taxCClass: {
    value: string;
    label: string;
  }) => {
    setPriceData((prev) => ({
      ...prev,
      [selectedChannelForTaxClassSearch]: {
        ...prev?.[selectedChannelForTaxClassSearch],
        taxClasses: [
          {
            id: taxCClass.value,
            name: taxCClass.label,
          },
        ],
      },
    }));
    setTaxClasses([]);
    closeModal();
  };

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
        const taxClasses = priceInfo[channel.id]?.taxClasses || [];
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
          {
            fieldType: FormFieldType.Display,
            name: 'taxClasses',
            label: 'Select Tax Categories',
            required: false,
            disabled: false,
            value: taxClasses?.[0]?.name || '',
            id: 'taxClasses',
            onClick: () => openTaxClassSearchModal(channel.id),
          },
        ];
      }) || []
    );
  }, [handlePriceInfoChange, openTaxClassSearchModal, priceData]);

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
          permission: 'PRZ:NN',
          label: 'Save',
          onSubmit: handleSaveStock,
          loading: loading,
        }}
        gridFields={[...createPriceGridForm()]}
      />
      {isOpen && (
        <FormInModal
          title='Select Tax Category'
          isOpen={isOpen}
          closeModal={closeModal}
        >
          <Input
            type='text'
            placeholder='Select Tax Category'
            name='productTypeId'
            onChange={handleTaxClassSearch}
          />
          <ul>
            {taxClasses.map((tax) => (
              <li
                key={tax.value}
                className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                onClick={() => handleTacClassSelect(tax)}
              >
                {tax.label}
              </li>
            ))}
          </ul>
        </FormInModal>
      )}
    </>
  );
};

export default PriceForm;
