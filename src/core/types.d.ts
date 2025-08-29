export interface IResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface IPage<T> {
  hits: T[];
  totalHitsCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ILoginFormProps {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ICustomerInfo {
  id: string;
  userGroupId: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  avatar: string | null;
  grandType: string;
  roleId: string;
  verified: boolean;
  active: boolean;
}

export interface IUserInfo {
  id: string;
  userGroupId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  grandType: string;
  roleId: string;
  verified: boolean;
  active: boolean;
  permissions: string;
}

export interface ISearchParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
  channel?: string;
  order?: 'asc' | 'desc';
  parent?: string;
}

export interface IOrderSearchParams extends ISearchParams {
  statuses?: string[];
  fromDate?: string;
  toDate?: string;
  excludeStatuses?: boolean;
}

export interface ITranslationParams {
  code?: string;
}

export interface IAttributeOption {
  label: string;
  value: string;
}

export interface IAttributes {
  [key: string]: {
    type: 'Select' | 'Number' | 'Boolean' | 'Text';
    options: IAttributeOption[] | null;
    value: string | number | boolean | IAttributeOption;
  };
}

export interface IAttributeListItem {
  key: string;
  type: 'Select' | 'Number' | 'Boolean' | 'Text';
  options: IAttributeOption[] | null;
  value: string | number | boolean | IAttributeOption;
}

export interface IProduct {
  id: string;
  name: string;
  skuId: string;
  categoryName: string | null;
  categoryId: string | null;
  brandName: string | null;
  brandId: string | null;
  productTypeId: string;
  publishedChannels: string[];
  attributes: IAttributes;
  active: boolean;
}

export interface IProductType {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  productAttributes?: IAttributes;
  variantAttributes?: IAttributes;
}

export interface IProductCreateFormInputs {
  name: string;
  skuId: string;
  productTypeId: string;
  categoryId: string | null;
  brandId: string | null;
  publishedChannels: string[];
  active?: boolean;
}

export interface IProductUpdateFormInputs {
  id: string;
  name?: string;
  categoryId?: string | null;
  brandId?: string | null;
  attributes?: IAttributes;
  publishedChannels?: string[];
}

export interface IProductCreateFormInputsWithAttributes
  extends IProductCreateFormInputs {
  attributes: IAttributes;
}

export interface IProductStatusUpdate {
  id: string;
  active: boolean;
}

export interface IProductTypeStatusUpdate {
  id: string;
  active: boolean;
}

export interface IVariantStatusUpdate {
  id: string;
  active: boolean;
}

export interface IProductTypeFormInputs {
  id: string;
  name: string;
  slug: string;
  productAttributes: IAttributes;
  variantAttributes: IAttributes;
  active?: boolean;
}

export interface IImage {
  type: string;
  defaultSrc: string;
  lg: string | null;
  md: string | null;
  sm: string | null;
  alt: string | null;
  index?: number;
}

export interface IVariant {
  id: string;
  name: string;
  slug: string;
  productId: string | null;
  skuId: string;
  productTypeId: string;
  url: string;
  medias: IImage[] | [];
  attributes?: IAttributes;
  seoTitle?: string;
  seoDescription?: string;
  active: boolean;
}

export interface IVariantFormInputs {
  id: string;
  name: string;
  slug: string;
  productId: string | null;
  skuId: string;
  seoTitle: string;
  seoDescription: string;
  medias: IImage[] | [];
  attributes: IAttributes;
  active?: boolean;
}

export interface IStockInfoItem {
  totalStocks: number;
  reservedStocks: number;
  safetyStocks: number;
}

export interface IStockInfo {
  [key: string]: IStockInfoItem;
}

export interface IStock {
  id?: string;
  variantId: string;
  stockInfo: IStockInfo;
}

export interface IPriceInfoItem {
  taxClasses: { id: string; name: string }[];
  salesPrice: number;
}

export interface IPriceInfo {
  [key: string]: IPriceInfoItem;
}

export interface IPrice {
  skuId: string;
  priceInfo: IPriceInfo;
}

export interface ICategory {
  id: string;
  name: string;
  parentName?: string;
  parentId?: string | null;
  seoTitle: string;
  seoDescription: string;
  active: boolean;
}

export interface IBrand {
  id: string;
  name: string;
  avatar: string;
  seoTitle: string;
  seoDescription: string;
  active: boolean;
}

export interface IModule {
  id?: string;
  resourceId: string;
  data: string;
  translations: Record<string, string>;
  active: boolean;
}

export interface IUserStatusUpdate {
  id: string;
  active: boolean;
}

export interface IRolePermissionItem {
  [key: string]: string[];
}

export interface IRole {
  id: string;
  uniqueId: string;
  name: string;
  description: string;
  permissionList: IRolePermissionItem;
  default: boolean;
  active: boolean;
}

export interface ITax {
  id?: string;
  name: string;
  rate: number;
  active: boolean;
  applicableChannels: string[];
  fixed: boolean;
}

export interface ITaxStatusUpdate {
  id: string;
  active: boolean;
}

export interface IOrderPrice {
  subtotalPrice: number;
  totalTaxPrice: number;
  shippingPrice: number;
  totalDiscountPrice: number;
  grandTotalPrice: number;
}

export interface IOrderItemPrice {
  salesPrice: number;
  discountName: string | null;
  discountedPrice: number;
  discountPercentage: number;
  discountFlatPrice: number;
  taxValue: number;
  taxPrice: number;
  isFixedTax: boolean;
  finalPrice: number;
}

export interface IMiniLineItemVariant {
  id: string;
  name: string;
  slug: string;
  productId: string;
  skuId: string;
  productTypeId: string;
  url: string;
  medias: IImage[];
  active: boolean;
}

export interface IMiniLineItem {
  id: string;
  productName: string;
  variant: IMiniLineItemVariant;
  quantity: number;
  itemPrice: IOrderItemPrice;
  error: null;
}

export interface IOrderEventItem {
  at: string;
  by: string;
  note: string;
}

export interface IOrderEvents {
  [key: string]: IOrderEventItem;
}

export interface IOrderLineItem extends IMiniLineItem {
  product: IProduct;
  variant: IVariant;
  unitIds?: string[];
  packageIds?: string[];
}

export interface IMiniOrder {
  id: string;
  status: string;
  userId: string;
  email: string | null;
  channelId: string;
  lineItems: IMiniLineItem[];
  coupon: null;
  price: IOrderPrice;
  guestOrder: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderPaymentOption {
  active: true;
  id: string;
  name: string;
  applicableChannels: string[];
  mode: 'Cod' | 'Online';
  external: boolean;
}

export interface IOrderPaymentInfo {
  mode: IOrderPaymentOption;
  amount: number;
  uniqueId?: string;
  method?: string;
  paymentId?: string;
  paymentAt?: string;
  status: string;
}

export interface IOrder extends IMiniOrder {
  lineItems: IOrderLineItem[];
  shippingAddress?: IAddress | null;
  billingAddress?: IAddress | null;
  paymentOptions?: IOrderPaymentOption[];
  paymentInfo?: IOrderPaymentInfo;
  paymentLink?: string;
  guestOrder: boolean;
  events?: IOrderEvents;
}

export interface ICreateCartRequestInputs {
  userId: string;
  channelId: string;
}

export interface IAddress {
  sourceId?: string;
  addressType: 'Shipping' | 'Billing';
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  city: string;
  area: string;
  pinCode: string;
}

export interface IAPIKey {
  id: string;
  name: string;
  apiKey: string;
  roleId: string;
  active: boolean;
}

export interface IAPIKeyWithSecret extends IAPIKey {
  apiSecret: string;
}

export interface ICustomApp {
  id: string;
  name: string;
  logo: string;
  description: string;
  appType: string;
  connectionUrl: string;
  githubUrl: string;
  applicableChannels: string[];
  active: boolean;
}

export interface IAppManifest {
  name: string;
  logo: string;
  description: string;
  appType: string;
  connectionUrl: string;
  applicableChannels?: string[];
}

export interface IPaymentLink {
  paymentLink?: string;
}

export interface OrderFilter {
  statuses?: string[];
  fromDate?: string;
  toDate?: string;
  excludeStatuses?: boolean;
}

export interface ITranslation {
  id: string;
  uniqueId: string;
  type: string;
  translations: Record<string, string>;
  active: boolean;
  languageCode: string;
}

export interface IDashboardData {
  id: string;
  year: number;
  initialCustomersCount: number;
  newCustomersCount: number;
  initialOrdersCount: number;
  newOrdersCount: number;
  monthlyRevenue: number;
  draftOrderRevenue: number;
  draftOrderCount: number;
  monthlySales: Record<string, number>;
  channelSalesReport: Record<string, number>;
  active: boolean;
}
