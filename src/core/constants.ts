export const CHANNELS = [
  {
    id: '68374ac320d736a89de249a0',
    name: 'Indian Marketplace',
    locale: 'en-in',
    currency: '₹',
    translations: [
      {
        code: 'AR',
        name: 'Arabic',
      },
    ],
  },
];

export const DEFAULT_TRANSLATION_LANGUAGE = 'AR';

export const ATTRIBUTE_TYPES = ['Text', 'Number', 'Select', 'Boolean'];

export const ASPECT_RATIOS = {
  variantImage: 1 / 1,
};

export const AllModules: string[] = [
  'Brand',
  'Variant',
  'Category',
  'User',
  'Modules',
  'ProductType',
  'Product',
  'Roles',
  'Promotion',
  'Prize',
  'Stock',
  'Taxes',
  'Orders',
  'CustomApps',
  'ApiKeys',
];

export const AllPermissions: string[] = ['READ', 'EDIT', 'DELETE'];

export const DEFAULT_ROLE = 'User';

export const DATE_TIME_FORMAT = 'DD-MM-YYYY hh:mm A';

export const DATE_FORMAT = 'DD-MM-YYYY';

export const ORDER_NORMAL_EVENTS = [
  'Created',
  'PaymentInitialised',
  'Submitted',
  'fulfillment',
  // 'Invoiced',    TODO: will do it later
  'Shipped',
  'OutOfDelivery',
];

export const ORDER_RETURN_EVENTS = [
  'WaitingForReturnConfirmation',
  'ReturnConfirmed',
  'ReturnShipped',
  'RefundConfirmed',
  'Refunded',
  'RefundCancelled',
];

export const TRANSLATION_FIELDS = {
  PRODUCT: ['name'],
  VARIANT: ['name', 'seoTitle', 'seoDescription'],
};
