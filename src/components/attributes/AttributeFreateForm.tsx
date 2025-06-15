import { FC } from 'react';
import AttributeFormInputs from '../form/form-elements/AttributeFormInputs';
import { IAttributeListItem } from '@/core/types';

interface AttributeCreateFormProps {
  heading: string;
  allAttributes: IAttributeListItem[];
  setAllAttributes: (attributes: IAttributeListItem[]) => void;
  disabled: boolean;
}

const AttributeCreateForm: FC<AttributeCreateFormProps> = ({
  heading,
  allAttributes,
  setAllAttributes,
  disabled,
}) => {
  const attributeCta = {
    label: 'New Attribute',
    loading: false,
  };

  return (
    <AttributeFormInputs
      heading={heading}
      cta={attributeCta}
      disabled={disabled}
      allAttributes={allAttributes}
      setAllAttributes={setAllAttributes}
    />
  );
};

export default AttributeCreateForm;
