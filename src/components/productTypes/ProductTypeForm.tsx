'use client';

import { IAttributes, IProductType, IProductTypeCreateFormInputs } from '@/core/types';
import { FormFieldType } from '../form/form-elements/DefaultFormFields';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { FC, useEffect, useState } from 'react';

import { useModal } from '@/hooks/useModal';
import Alert from '../ui/alert/Alert';
import { useRouter } from 'next/navigation';
import AttributeCreateForm from '../attributes/AttributeFreateForm';

interface ProductTypeFormProps {
  productType?: IProductType;
}

const ProductTypeForm: FC<ProductTypeFormProps> = ({productType }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const router = useRouter();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const [createProductTypeForm, setCreateProductTypeForm] =
    useState<IProductTypeCreateFormInputs>({
      name: productType?.name || '',
      slug: productType?.slug || '',
      productAttributes: productType?.productAttributes || {},
    });

  const [productTypeAttributes, setProductTypeAttributes] = useState<IAttributes>(
    productType?.productAttributes || {}
  );

  const handleSave = async () => {
    setLoading(true);
    // const method = product?.id ? updateProductApi : createProductAPI;
    // const response = await method({
    //   id: product?.id || '',
    //   ...createProductForm,
    //   attributes: productAttributes,
    // });
    // setLoading(false);
    // setAlerts([
    //   {
    //     message:
    //       response.message ||
    //       (response.success
    //         ? 'Product saved successfully'
    //         : 'Failed to save product'),
    //     variant: response.success ? 'success' : 'error',
    //   },
    // ]);
    // if (!product?.id && response.success) {
    //   router.push(`/products/${response.data?.id}`);
    // }
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    // const response = await productStatusUpdateApi(product?.id || '', active);
    // setStatusLoading(false);
    // if (response.success) {
    //   setAlerts([
    //     {
    //       message: response.message || 'Product status updated successfully',
    //       variant: 'success',
    //     },
    //   ]);
    //   setCreateProductTypeForm((prev) => ({
    //     ...prev,
    //     active,
    //   }));
    // }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Product type Name',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateProductTypeForm((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: createProductTypeForm.name,
      placeholder: 'Lucci vasqqi...',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid product name',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'slug',
      label: 'Product type Slug',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateProductTypeForm((prev) => ({
          ...prev,
          skuId: event.target.value,
        }));
      },
      value: createProductTypeForm.slug,
      placeholder: 'lucci-vasqqi',
      id: 'slug',
      required: true,
      disabled: productType?.id ? true : false,
      error: false,
      hint: 'Please enter valid slug',
    }
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const productStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : createProductTypeForm.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: productType?.id ? false : true,
    checked: createProductTypeForm.active ?? true,
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
              label: 'Save Product Type',
              loading: loading,
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleSave();
              },
            }}
            heading='Product Type Form'
            fields={fields}
          />
          <AttributeCreateForm/>
          {/* {createProductTypeForm.productTypeId && (
            <AttributeForm
              title='Product Attributes'
              productTypeId={createProductTypeForm.productTypeId}
              attributes={productAttributes}
              setAttributes={setProductAttributes}
            />
          )} */}
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Product Type Status'
              fields={[productStatusFields]}
            />
          </div>
        </div>
      </div>
      {/* {isOpen && (
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
      )} */}
    </>
  );
};

export default ProductTypeForm;
