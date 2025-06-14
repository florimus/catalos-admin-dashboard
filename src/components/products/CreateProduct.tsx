'use client';

import { IAttributes, IProductCreateFormInputs } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useState } from 'react';
import {
  channelToMultiSelectMapper,
  productTypesToSingleSelectMapper,
} from '@/utils/mapperUtils';
import { CHANNELS } from '@/core/constants';
import FormInModal from '../modals/FormInModal';
import { useModal } from '@/hooks/useModal';
import Input from '../form/input/InputField';
import { getProductTypeList } from '@/actions/product-type';
import AttributeForm from '../attributes/AttributeForm';

interface CreateProductFormProps {
  productTypeOptions?: { value: string; label: string }[];
}

const CreateProductForm: FC<CreateProductFormProps> = ({
  productTypeOptions,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  const [createProductForm, setCreateProductForm] =
    useState<IProductCreateFormInputs>({
      name: '',
      skuId: '',
      productTypeId: '',
      publishedChannels: [],
    });

  const [productAttributes, setProductAttributes] = useState<IAttributes>({});

  const [productTypes, setProductTypes] = useState<
    { value: string; label: string }[]
  >(productTypeOptions || []);

  const handleSave = () => {
    console.log('Form submitted', { ...createProductForm, productAttributes });
  };

  const handleProductTypeSelect = (value: string) => {
    setCreateProductForm((prev) => ({
      ...prev,
      productTypeId: value,
    }));
    closeModal();
  };

  const handleProductTypeSearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setProductTypes(productTypeOptions || []);
      return;
    }
    const response = await getProductTypeList(event.target.value);
    if (response.success && response.data?.hits) {
      setProductTypes(productTypesToSingleSelectMapper(response.data.hits));
    }
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
      fieldType: FormFieldType.Display,
      name: 'productTypeId',
      label: 'Select Product Type',
      required: true,
      disabled: false,
      value:
        productTypes.find(
          (type) => type.value === createProductForm.productTypeId
        )?.label || 'Select Product Type',
      id: 'productTypeId',
      onClick: openModal,
    },
  ];

  return (
    <>
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
          {isOpen && (
            <FormInModal
              title='Select Product Type'
              isOpen={isOpen}
              closeModal={closeModal}
            >
              <Input
                type='text'
                placeholder='Select ProductType'
                name='productTypeId'
                onChange={handleProductTypeSearch}
              />
              <ul>
                {productTypes.map((type) => (
                  <li
                    key={type.value}
                    className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                    onClick={() => handleProductTypeSelect(type.value)}
                  >
                    {type.label}
                  </li>
                ))}
              </ul>
            </FormInModal>
          )}
        </div>
      </div>
      {createProductForm.productTypeId && (
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-3 my-5'>
          <div className='grid col-span-1 xl:col-span-2'>
            <AttributeForm
              title='Product Attributes'
              productTypeId={createProductForm.productTypeId}
              attributes={productAttributes}
              setAttributes={setProductAttributes}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProductForm;
