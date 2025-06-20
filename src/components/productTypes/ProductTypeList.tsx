'use client';
import { IProductType } from '@/core/types';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';
import { useRouter } from 'next/navigation';
import { useGlobalLoader } from '@/context/GlobalLoaderContext';

interface ProductTypeListProps {
  hits?: IProductType[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ProductTypeList: React.FC<ProductTypeListProps> = ({
  hits = [],
  ...rest
}) => {
  const headingData: string[] = ['Name', 'Product type Id', 'Slug', 'Status'];

  const router = useRouter();
  const { start } = useGlobalLoader();

  const goToProductTypeDetails = (productTypeId: string) =>
    start(() => router.push(`/product-types/${productTypeId}`));

  const tableData =
    hits?.map((productType) => [
      {
        type: TableCellTypes.TextCell,
        text: productType.name || '',
        onclick: () => goToProductTypeDetails(productType.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: productType.id || '',
        onclick: () => goToProductTypeDetails(productType.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: productType.slug || '',
      },
      {
        type: TableCellTypes.StatusCell,
        status: productType.active ? 'Online' : 'Offline',
        color: productType.active ? 'success' : 'dark',
      },
    ]) || [];

  return (
    <BasicTableOne
      headingData={headingData}
      tableData={tableData}
      pageProps={rest}
    />
  );
};

export default ProductTypeList;
