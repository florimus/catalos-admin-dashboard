import { FC } from 'react';
import AttributeFormInputs from '../form/form-elements/AttributeFormInputs';
import { IAttributeListItem } from '@/core/types';

interface AttributeCreateFormProps {
  allAttributes: IAttributeListItem[];
  setAllAttributes: (attributes: IAttributeListItem[]) => void;
}

const AttributeCreateForm: FC<AttributeCreateFormProps> = ({
  allAttributes,
  setAllAttributes,
}) => {
  const attributeCta = {
    label: 'New Attribute',
    loading: false,
  };

  return (
    <AttributeFormInputs
      heading='Attributes'
      cta={attributeCta}
      allAttributes={allAttributes}
      setAllAttributes={setAllAttributes}
    />
  );
};

export default AttributeCreateForm;
