import { FC } from 'react';
import AttributeFormInputs from '../form/form-elements/AttributeFormInputs';

interface AttributeCreateFormProps {}

const AttributeCreateForm: FC<AttributeCreateFormProps> = () => {
  const attributeCta = {
    label: 'New Attribute',
    loading: false,
    onSubmit: () => {}
  }

  return <AttributeFormInputs heading='Attributes' cta={attributeCta} fields={[]} />
};

export default AttributeCreateForm;
