import { IProduct } from '@/core/types';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';

interface ProductListProps {
  hits?: IProduct[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  hits = [],
  ...rest
}) => {
  const headingData: string[] = [
    'Product',
    'Category',
    'Brand',
    'Status',
    'Channels',
  ];

  const tableData =
    hits?.map((product) => [
      {
        type: TableCellTypes.ProfileCell,
        hasAvatar: false,
        primaryText: product.name,
        secondaryText: product.skuId,
      },
      {
        type: TableCellTypes.TextCell,
        text: product.categoryId || 'Un Categorized',
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
  return <BasicTableOne headingData={headingData} tableData={tableData} pageProps={rest} />;
};

export default ProductList;
