'use client';

import { FC, useEffect, useState } from 'react';
import Alert from '../ui/alert/Alert';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import {
  IAttributes,
  IImage,
  IModule,
  IProduct,
  IProductType,
  IResponse,
  IVariant,
  IVariantFormInputs,
  IVariantStatusUpdate,
} from '@/core/types';
import { FormFieldType, ITextAreaFormFieldProps } from '../form/form-elements/DefaultFormFields';
import AttributeForm from '../attributes/AttributeForm';
import { AttributeTypes } from '@/core/enums';
import {
  createVariantAPI,
  updateVariantAPI,
  updateVariantStatusAPI,
} from '@/actions/variant';
import { formatAttributeValues } from '@/utils/mapperUtils';
import { useRouter } from 'next/navigation';
import DropzoneComponent from '../form/form-elements/DropZone';
import {
  convertToIImage,
  IUploadedImage,
  uploadImages,
} from '@/utils/imageUtils';
import ImageGallery from '../form/form-elements/ImageGalery';
import { useModal } from '@/hooks/useModal';
import CropModal from '../common/CropModal';
import { ASPECT_RATIOS } from '@/core/constants';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';
import dynamic from 'next/dynamic';
import SecureComponent from '@/core/authentication/SecureComponent';
import Button from '../ui/button/Button';
import { ArrowRightIcon } from '@/icons';
const ModuleView = dynamic(() => import('../modules/ModuleView'), {
  ssr: false,
});

interface VariantFormProps {
  productType: IProductType;
  product: IProduct;
  variant?: IVariant;
  children?: React.ReactNode;
  contentModule?: IModule;
}

const VariantForm: FC<VariantFormProps> = ({
  productType,
  product,
  variant,
  children,
  contentModule,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const {
    isOpen: isCropModalOpen,
    openModal: openFullscreenModal,
    closeModal: closeCropModal,
  } = useModal();

  const router = useRouter();
  const { start } = useGlobalLoader();

  const [alerts, setAlerts] = useState<{ message: string; variant: string }[]>(
    []
  );

  const [editingImage, setEditingImage] = useState<IImage | null>(null);

  const [attributes, setAttributes] = useState<IAttributes>(
    variant?.attributes || {}
  );

  const [variantFormFields, setVariantFormFields] =
    useState<IVariantFormInputs>({
      id: variant?.id || '',
      name: variant?.name || '',
      slug: variant?.slug || '',
      productId: product.id,
      skuId: variant?.skuId || '',
      medias: variant?.medias || [],
      seoTitle: variant?.seoTitle || '',
      seoDescription: variant?.seoDescription || '',
      attributes: variant?.attributes || {},
      active: variant?.active || false,
    });

  const handleUpdateMedia = async (image: IImage) => {
    const currentImages = variantFormFields.medias;
    const newImages = currentImages.map((img, index) => {
      if (index === image.index) {
        return image;
      }
      return img;
    });
    setVariantFormFields((prev) => ({
      ...prev,
      medias: newImages,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleOpenImageCropEditor = (index: number, image: IImage) => {
    setEditingImage({ ...image, index });
    openFullscreenModal();
  };

  const handleDeleteImage = (index: number) => {
    setVariantFormFields((prev) => ({
      ...prev,
      medias: prev.medias.filter((img, i) => i !== index),
    }));
  };

  const handleCloseImageCropEditor = () => {
    setEditingImage(null);
    closeCropModal();
  };

  const handleProductStatusUpdate = async (active: boolean) => {
    setStatusLoading(true);
    const response: IResponse<IVariantStatusUpdate> =
      await updateVariantStatusAPI(variant?.id || '', active);
    setStatusLoading(false);
    setAlerts([
      {
        message:
          response.message ||
          (response.success
            ? 'Variant status updated successfully'
            : 'Failed to update Variant status'),
        variant: response.success ? 'success' : 'error',
      },
    ]);
    if (response.success) {
      setVariantFormFields((prev) => ({
        ...prev,
        active,
      }));
    }
  };

  const handleImageDrop = async (files: File[]) => {
    setImageUploading(true);
    const uploadedImages: IUploadedImage[] = await uploadImages(files);
    setVariantFormFields((prev) => ({
      ...prev,
      medias: [...convertToIImage(uploadedImages), ...prev.medias],
    }));
    setImageUploading(false);
  };

  const handleSaveVariant = async () => {
    setLoading(true);
    const method = variant?.id ? updateVariantAPI : createVariantAPI;
    const response: IResponse<IVariant> = await method({
      ...variantFormFields,
      attributes: formatAttributeValues(attributes),
    });
    setLoading(false);
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
    if (!variant?.id && response.success) {
      start(() => router.push(`/variants/${response.data?.id}`));
    }
  };

  const fields = [
    {
      fieldType: FormFieldType.Text,
      name: 'name',
      label: 'Variant Term',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          name: event.target.value,
        }));
      },
      value: variantFormFields.name,
      placeholder: 'Pro Plus',
      id: 'name',
      required: true,
      disabled: false,
      error: false,
      hint: 'Please enter valid variant term',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'slug',
      label: 'Variant Slug',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          slug: event.target.value,
        }));
      },
      value: variantFormFields.slug,
      placeholder: 'pro-plus',
      id: 'slug',
      required: true,
      disabled: variant?.id ? true : false,
      error: false,
      hint: 'Please enter valid variant slug',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'parentId',
      label: 'Parent',
      onChange: () => {},
      value: product.name,
      placeholder: 'pro-plus',
      id: 'slug',
      required: true,
      disabled: true,
      error: false,
      hint: 'Please enter valid variant slug',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'skuId',
      label: 'Variant skuId',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          skuId: event.target.value,
        }));
      },
      value: variantFormFields.skuId,
      placeholder: `${product.skuId}-1`,
      id: 'skuId',
      required: true,
      disabled: variant?.id ? true : false,
      error: false,
      hint: 'Please enter valid variant skuId',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'productTypeId',
      label: 'Variant Type',
      onChange: () => {},
      value: productType.name,
      placeholder: 'pro-plus',
      id: 'productTypeId',
      required: true,
      disabled: true,
      error: false,
      hint: 'Please enter valid variant productTypeId',
    },
    {
      fieldType: FormFieldType.Text,
      name: 'seoTitle',
      label: 'Seo Title',
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          seoTitle: event.target.value,
        }));
      },
      value: variantFormFields.seoTitle,
      placeholder: `${product.name} | catalos`,
      id: 'seoTitle',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid variant seoTitle',
    },
    {
      fieldType: FormFieldType.TextArea,
      name: 'seoDescription',
      label: 'Seo Description',
      onChange: (event: React.ChangeEvent<ITextAreaFormFieldProps>) => {
        setVariantFormFields((prev) => ({
          ...prev,
          seoDescription: event.target.value,
        }));
      },
      value: variantFormFields.seoDescription,
      placeholder: 'Pro Plus....',
      id: 'name',
      required: false,
      disabled: false,
      error: false,
      hint: 'Please enter valid seoDescription',
    },
  ];

  const statusLoader = (
    <div className='h-4 w-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin' />
  );

  const variantStatusFields = {
    fieldType: FormFieldType.Switch,
    label: statusLoading
      ? statusLoader
      : variantFormFields.active
      ? 'Online'
      : 'Offline',
    name: 'product-status',
    disabled: variant?.id ? false : true,
    checked: variantFormFields.active || false,
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
          <div>
            <DefaultInputs
              cta={{
                permission: 'VAR:NN',
                label: 'Save variant',
                loading: loading,
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleSaveVariant();
                },
              }}
              heading='Variant Form'
              fields={fields}
            />
            {productType.id && (
              <div>
                <AttributeForm
                  title='Attributes'
                  productTypeId={productType.id}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  attributeType={AttributeTypes.Variant}
                />
              </div>
            )}
            {children}
          </div>
        </div>
        <div className='grid col-span-1'>
          <div>
            <DefaultInputs
              heading='Variant Status'
              fields={[variantStatusFields]}
            />
            <div className='flex justify-end w-full'>
              <Button
                size='sm'
                className='my-1 mb-6 flex w-full'
                onClick={() =>
                  start(() =>
                    router.push(`/variants/${variant?.id}/translations`)
                  )
                }
              >
                Manage Translations <ArrowRightIcon />
              </Button>
            </div>
            <SecureComponent permission='VAR:NN'>
              <DropzoneComponent
                loading={imageUploading}
                onDrop={handleImageDrop}
              />
            </SecureComponent>
            <ImageGallery
              images={variantFormFields.medias}
              showOverlay={true}
              handleEdit={handleOpenImageCropEditor}
              handleDelete={handleDeleteImage}
            />
          </div>
        </div>
      </div>
      {variant?.id && (
        <SecureComponent permission='MOD:LS'>
          <ModuleView
            projectData={contentModule?.data || ''}
            moduleId={variant.id}
          />
        </SecureComponent>
      )}
      {editingImage && (
        <CropModal
          isOpen={isCropModalOpen}
          closeModal={handleCloseImageCropEditor}
          image={editingImage}
          aspectRatio={ASPECT_RATIOS.variantImage}
          handleUpdateMedia={handleUpdateMedia}
          setAlerts={setAlerts}
        />
      )}
    </>
  );
};

export default VariantForm;
