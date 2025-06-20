'use client';

import {
  IAttributes,
  ICategory,
  IProduct,
  IProductCreateFormInputs,
} from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useEffect, useState } from 'react';
import {
  categoryToSingleSelectMapper,
  channelToMultiSelectMapper,
  formatAttributeValues,
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
import Alert from '../ui/alert/Alert';
import { useRouter } from 'next/navigation';
import { getCategories } from '@/actions/category';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface ProductFormProps {
  productTypeOptions?: { value: string; label: string }[];
  product?: IProduct;
  initialCategories?: ICategory[];
}

const ProductForm: FC<ProductFormProps> = ({
  productTypeOptions,
  product,
  initialCategories,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isCategoryOpen,
    openModal: openCategoryModal,
    closeModal: closeCategoryModal,
  } = useModal();
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

  const [createProductForm, setCreateProductForm] =
    useState<IProductCreateFormInputs>({
      name: product?.name || '',
      skuId: product?.skuId || '',
      productTypeId: product?.productTypeId || '',
      active: product?.active || false,
      categoryId: product?.categoryId || null,
      publishedChannels: product?.publishedChannels || [],
    });

  const [productAttributes, setProductAttributes] = useState<IAttributes>(
    product?.attributes || {}
  );

  const [productTypes, setProductTypes] = useState<
    { value: string; label: string }[]
  >(productTypeOptions || []);

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >(initialCategories ? categoryToSingleSelectMapper(initialCategories) : []);

  const handleSave = async () => {
    setLoading(true);
    const method = product?.id ? updateProductApi : createProductAPI;
    const response = await method({
      id: product?.id || '',
      ...createProductForm,
      attributes: formatAttributeValues(productAttributes),
    });
    setLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Product saved successfully'
            : 'Failed to save product'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (!product?.id && response.success) {
      start(() => router.push(`/products/${response.data?.id}`));
    }
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response = await productStatusUpdateApi(product?.id || '', active);
    setStatusLoading(false);
    if (response.success) {
      setAlerts([
        {
          message: response.message || 'Product status updated successfully',
          variant: 'success',
        },
      ]);
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

  const handleCategorySelect = (value: string) => {
    setCreateProductForm((prev) => ({
      ...prev,
      categoryId: value,
    }));
    closeCategoryModal();
  };

  const handleCategorySearch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.trim() === '') {
      setCategories(
        initialCategories ? categoryToSingleSelectMapper(initialCategories) : []
      );
      return;
    }
    const response = await getCategories(event.target.value);
    if (response.success && response.data?.hits) {
      setCategories(categoryToSingleSelectMapper(response.data.hits));
    }
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
    {
      fieldType: FormFieldType.Display,
      name: 'categoryId',
      label: 'Select Category',
      required: true,
      disabled: false,
      value:
        categories.find(
          (category) => category.value === createProductForm.categoryId
        )?.label || 'Select Category',
      id: 'categoryId',
      onClick: openCategoryModal,
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const productStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : createProductForm.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: product?.id ? false : true,
    checked: createProductForm.active || false,
    onChange: (checked: boolean) => handleProductStatusUpdate(checked),
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
      {isCategoryOpen && (
        <FormInModal
          title='Select Category'
          isOpen={isCategoryOpen}
          closeModal={closeCategoryModal}
        >
          <Input
            type='text'
            placeholder='Select Category'
            name='categoryIdModal'
            onChange={handleCategorySearch}
          />
          <ul>
            {categories.map((type, index) => (
              <li
                key={`${type.value}_${index}`}
                className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 mt-2.5 text-gray-800 dark:text-white rounded-md'
                onClick={() => handleCategorySelect(type.value)}
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
