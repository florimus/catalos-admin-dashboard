'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import DefaultInputs from '../form/form-elements/DefaultInputs';
import { getProductTypeById } from '@/actions/product-type';
import { IAttributes, IProductType, IResponse } from '@/core/types';
import { attributesToFormFieldMapper } from '@/utils/mapperUtils';
import { AttributeTypes } from '@/core/enums';

interface IAttributeFormProps {
  title: string;
  productTypeId: string;
  attributes: IAttributes;
  setAttributes: (attributes: IAttributes) => void;
  attributeType?: AttributeTypes;
}

const AttributeForm: FC<IAttributeFormProps> = ({
  title = 'Attribute Form',
  productTypeId,
  attributes = {},
  setAttributes,
  attributeType = AttributeTypes.Product,
}) => {
  const [fetchedAttributes, setFetchedAttributes] = useState<IAttributes>({});

  const fetchAttributes = useCallback(
    async (productTypeId: string) => {
      const response: IResponse<IProductType> = await getProductTypeById(
        productTypeId
      );
      if (response?.success && response?.data) {
        const attributes =
          attributeType === AttributeTypes.Product
            ? response.data.productAttributes
            : response.data.variantAttributes;
        setFetchedAttributes(attributes || {});
      }
    },
    [attributeType]
  );

  useEffect(() => {
    fetchAttributes(productTypeId);
  }, [fetchAttributes, productTypeId]);
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
