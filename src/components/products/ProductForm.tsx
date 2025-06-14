'use client';

import { IAttributes, IProduct, IProductCreateFormInputs } from '@/core/types';
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
import {
  createProductAPI,
  productStatusUpdateApi,
  updateProductApi,
} from '@/actions/product';

interface ProductFormProps {
  productTypeOptions?: { value: string; label: string }[];
  product?: IProduct;
}

const ProductForm: FC<ProductFormProps> = ({ productTypeOptions, product }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const [createProductForm, setCreateProductForm] =
    useState<IProductCreateFormInputs>({
      name: product?.name || '',
      skuId: product?.skuId || '',
      productTypeId: product?.productTypeId || '',
      active: product?.active || false,
      publishedChannels: product?.publishedChannels || [],
    });

  const [productAttributes, setProductAttributes] = useState<IAttributes>(
    product?.attributes || {}
  );

  const [productTypes, setProductTypes] = useState<
    { value: string; label: string }[]
  >(productTypeOptions || []);

  const handleSave = async () => {
    setLoading(true);
    const method = product?.id ? updateProductApi : createProductAPI;
    const response = await method({
      id: product?.id || '',
      ...createProductForm,
      attributes: productAttributes,
    });
    setLoading(false);
    if (response.success) {
    }
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await productStatusUpdateApi(product?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setCreateProductForm((prev) => ({
        ...prev,
        active,
      }));
    }
  };

  const handleProductTypeSelect = (value: string) => {
    setCreateProductForm((prev) => ({
      ...prev,
      productTypeId: value,
    }));
    setProductAttributes({});
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
      disabled: product?.id ? true : false,
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
      disabled: product?.id ? true : false,
      value:
        productTypes.find(
          (type) => type.value === createProductForm.productTypeId
        )?.label || 'Select Product Type',
      id: 'productTypeId',
      onClick: openModal,
    },
  ];

  const statusLoader = <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />;

  const productStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading ? statusLoader : createProductForm.active ? 'Online' : 'Offline',
    name: 'product-status',
    disabled: product?.id ? false : true,
    checked: createProductForm.active || false,
    onChange: (checked: boolean) => handleProductStatusUpdate(checked),
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='grid col-span-1 xl:col-span-2'>
          <DefaultInputs
            cta={{
              label: 'Save Product',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Product Form'
            fields={fields}
          />
          {createProductForm.productTypeId && (
            <AttributeForm
              title='Product Attributes'
              productTypeId={createProductForm.productTypeId}
              attributes={productAttributes}
              setAttributes={setProductAttributes}
            />
          )}
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Product Status'
              fields={[productStatusFields]}
            />
          </div>
        </div>
      </div>
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
    </>
  );
};

export default ProductForm;
