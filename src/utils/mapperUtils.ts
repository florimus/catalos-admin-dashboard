import { IProductType } from '@/core/types';

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
