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

export interface IUserInfo {
  id: string;
  userGroupId: string;
  firstName: string;
  lastName: string;
  email: string;
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
  order?: 'asc' | 'desc';
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
  categoryId: string | null;
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
  publishedChannels: string[];
  active?: boolean;
}

export interface IProductUpdateFormInputs {
  id: string;
  name?: string;
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
}

export interface IVariant {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  skuId: string;
  productTypeId: string;
  url: string;
  medias: IImage[] | [];
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
