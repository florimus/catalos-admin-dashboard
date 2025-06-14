'use client';

import { FC, useEffect, useState } from 'react';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { getProductTypeById } from '@/actions/product-type';
import { IAttributes, IProductType, IResponse } from '@/core/types';
import { attributesToFormFieldMapper } from '@/utils/mapperUtils';

interface IAttributeFormProps {
  title: string;
  productTypeId: string;
  attributes: IAttributes;
  setAttributes: (attributes: IAttributes) => void;
}

const AttributeForm: FC<IAttributeFormProps> = ({
  title = 'Attribute Form',
  productTypeId,
  attributes = {},
  setAttributes,
}) => {
  const [fetchedAttributes, setFetchedAttributes] =
    useState<IAttributes>({});

  const fetchAttributes = async (productTypeId: string) => {
    const response: IResponse<IProductType> = await getProductTypeById(
      productTypeId
    );
    if (response?.success && response?.data) {
      setFetchedAttributes(response.data.productAttributes || {});
    }
  };

  useEffect(() => {
    fetchAttributes(productTypeId);
  }, [productTypeId]);
  return (
    <DefaultInputs
      heading={title}
      fields={attributesToFormFieldMapper(
        fetchedAttributes,
        attributes,
        setAttributes
      )}
    />
  );
};

export default AttributeForm;
