import { FormFieldType } from '@/components/form/form-elements/DefaultFormFields';
import { IAttributeListItem, IAttributes, IProductType } from '@/core/types';

export const channelToMultiSelectMapper = (
  channels: { id: string; name: string }[]
) => {
  return channels.map((channel) => ({
    value: channel.id,
    text: channel.name,
    selected: false,
  }));
};

export const productTypesToSingleSelectMapper = (
  productTypes?: IProductType[]
) => {
  return Array.isArray(productTypes)
    ? productTypes.map((productType) => ({
        value: productType.id,
        label: productType.name,
      }))
    : [];
};

export const attributesToFormFieldMapper = (
  attributes: IAttributes = {},
  attributeStates: IAttributes = {},
  setAttributes: (attributes: IAttributes) => void
) => {
  const formFields = [];

  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const attribute = attributes[key];

      console.log(`Processing attribute: ${key}`, attribute);

      if (attribute.type === 'Text' || attribute.type === 'Number') {
        formFields.push({
          fieldType: FormFieldType.Text,
          name: key,
          label: `Enter ${key}`,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setAttributes({
              ...attributeStates,
              [key]: {
                ...attributes[key],
                value:
                  attribute.type === 'Number'
                    ? Number(event.target.value)
                    : event.target.value,
              },
            });
          },
          value: attributeStates?.[key]?.value || '',
          placeholder: attribute.type === 'Text' ? `Abc...` : `123...`,
          id: key,
          type: attribute.type === 'Number' ? 'number' : 'text',
          required: false,
        });
      } else if (attribute.type === 'Select') {
        formFields.push({
          fieldType: FormFieldType.DropDown,
          name: key,
          label: `Enter ${key}`,
          onChange: (value: string) => {
            setAttributes({
              ...attributeStates,
              [key]: {
                ...attributes[key],
                value: value,
              },
            });
          },
          options: attribute?.options || [],
          defaultValue: attributeStates?.[key]?.value || '',
          placeholder: `Select ${key}`,
          id: key,
          required: false,
        });
      } else if (attribute.type === 'Boolean') {
        formFields.push({
          fieldType: FormFieldType.Switch,
          name: key,
          label: `Enable ${key}`,
          onChange: (checked: boolean) => {
            setAttributes({
              ...attributeStates,
              [key]: {
                ...attributes[key],
                value: checked,
              },
            });
          },
          checked: attributeStates?.[key]?.value || false,
          id: key,
        });
      }
    }
  }

  return formFields;
};

export const attributeListToMapper = (attributes: IAttributeListItem[]) => {
  return attributes.reduce((acc, attribute) => {
    acc[attribute?.key] = {
      type: attribute.type,
      options: attribute.options,
      value: attribute.value,
    };
    return acc;
  }, {} as IAttributes);
};

export const attributesToAttributeListMapper = (attributes: IAttributes) => {
  return Object.keys(attributes).map((key) => ({
    key,
    type: attributes[key].type,
    options: attributes[key].options,
    value: attributes[key].value,
  }));
};
