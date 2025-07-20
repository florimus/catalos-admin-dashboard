import { FormFieldType } from '@/components/form/form-elements/DefaultFormFields';
import { CHANNELS } from '@/core/constants';
import {
  IAttributeListItem,
  IOrderPaymentOption,
  IAttributeOption,
  IAttributes,
  IBrand,
  ICategory,
  IImage,
  IProductType,
  IRole,
  ITax,
  IOrderLineItem,
} from '@/core/types';

export const channelToMultiSelectMapper = (
  channels: { id: string; name: string }[]
) => {
  return channels.map((channel) => ({
    value: channel.id,
    text: channel.name,
    selected: false,
  }));
};

export const channelToSingleSelectMapper = (
  channels: { id: string; name: string }[]
) => {
  return channels.map((channel) => ({
    value: channel.id,
    label: channel.name,
  }));
};

export const getChannelId = (channelId: string) => {
  return CHANNELS.find((channel) => {
    if (channel.id === channelId) {
      return channel.id;
    }
  });
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

      if (attribute.type === 'Text' || attribute.type === 'Number') {
        formFields.push({
          fieldType:
            ((attributeStates?.[key]?.value as string) || '')?.length > 100
              ? FormFieldType.TextArea
              : FormFieldType.Text,
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
          defaultValue:
            typeof attributeStates?.[key]?.value === 'object' &&
            'value' in attributeStates?.[key]?.value
              ? (attributeStates[key]?.value as IAttributeOption).value
              : '',
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

export const formatAttributeValues = (attributes: IAttributes) => {
  let list = attributesToAttributeListMapper(attributes);
  list = list.map((attribute) => {
    if (attribute.type === 'Select') {
      attribute.value =
        (attribute.options?.find(
          (option) => option.value === attribute.value
        ) as IAttributeOption) ||
        attribute.options?.find(
          (option) =>
            option.value === (attribute.value as IAttributeOption)?.value
        );
    }
    return attribute;
  });
  return attributeListToMapper(list);
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

export const categoryToSingleSelectMapper = (categories?: ICategory[]) => {
  return Array.isArray(categories)
    ? categories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    : [];
};

export const brandToSingleSelectMapper = (brands?: IBrand[]) => {
  return Array.isArray(brands)
    ? brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      }))
    : [];
};

export const urlToImageMapper: (url: string, alt: string) => IImage = (
  url: string,
  alt: string
) => {
  return {
    alt,
    type: 'Image',
    defaultSrc: url,
    lg: url,
    md: url,
    sm: url,
  };
};

export const rolesToSingleSelectMapper = (roles?: IRole[]) => {
  return Array.isArray(roles)
    ? roles.map((role) => ({
        value: role.uniqueId,
        label: role.uniqueId,
      }))
    : [];
};

export const taxesToMultiSelectMapper = (taxes: ITax[]) => {
  return taxes.map((tax) => ({
    value: tax.id || '',
    text: tax.name,
    selected: false,
  }));
};

export const taxesToSingleSelectMapper = (taxes: ITax[]) => {
  return taxes.map((tax) => ({
    value: tax.id || '',
    label: tax.name,
  }));
};

export const paymentOptionToSingleSelectMapper = (
  options: IOrderPaymentOption[]
) => {
  if (!options || !Array.isArray(options)) {
    return [];
  }
  return options.map((option) => ({
    value: option.id || '',
    label: option.name,
  }));
};

export const getUnitIdsFromLineItems = (
  lineItems?: IOrderLineItem[]
): { [lineItemId: string]: string[] } => {
  return (
    lineItems?.reduce((acc, lineItem) => {
      acc[lineItem.id] = lineItem.unitIds || [];
      return acc;
    }, {} as { [lineItemId: string]: string[] }) ?? {}
  );
};

export const getPackagesIdsFromLineItems = (
  lineItems?: IOrderLineItem[]
): { [lineItemId: string]: string[] } => {
  return (
    lineItems?.reduce((acc, lineItem) => {
      acc[lineItem.id] = lineItem.packageIds || [];
      return acc;
    }, {} as { [lineItemId: string]: string[] }) ?? {}
  );
};
