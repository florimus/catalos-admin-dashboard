'use client';

import { IProduct } from '@/core/types';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import { useRouter } from 'next/navigation';

interface ProductListProps {
  hits?: IProduct[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ hits = [], ...rest }) => {
  const headingData: string[] = [
    'Product',
    'Category',
    'Brand',
    'Status',
    'Channels',
  ];

  const router = useRouter();

  const goToProductDetails = (productId: string) =>
    router.push(`/products/${productId}`);

  const goToCategoryDetails = (categoryId: string) =>
    router.push(`/categories/${categoryId}`);

  const tableData =
    hits?.map((product) => [
      {
        type: TableCellTypes.ProfileCell,
        hasAvatar: false,
        primaryText: product.name,
        secondaryText: product.skuId,
        onclick: () => goToProductDetails(product.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: product.categoryName || 'Un Categorized',
        onclick: () => product.categoryId && goToCategoryDetails(product.categoryId),
      },
      {
        type: TableCellTypes.TextCell,
        text: product.brandId || 'Un Branded',
      },
      {
        type: TableCellTypes.StatusCell,
        status: product.active ? 'Online' : 'Offline',
        color: product.active ? 'success' : 'dark',
      },
      {
        type: TableCellTypes.TextCell,
        text: product.publishedChannels?.length || 0,
      },
    ]) || [];

  return (
    <BasicTableOne
      headingData={headingData}
      tableData={tableData}
      pageProps={rest}
      isEmpty={hits.length === 0}
    />
  );
};

export default ProductList;
