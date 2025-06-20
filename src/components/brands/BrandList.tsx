'use client';

import { IBrand } from '@/core/types';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { TableCellTypes } from '../tables/TableCells';
import BasicTableOne from '../tables/BasicTableOne';

interface BrandListProps {
  hits?: IBrand[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}
const BrandList: FC<BrandListProps> = ({ hits = [], ...rest }) => {
  const headingData: string[] = ['Brand', 'Status', 'SEO Title'];

  const router = useRouter();

  const goToBrandDetails = (brandId: string) =>
    router.push(`/brands/${brandId}`);

  const tableData =
    hits?.map((brand) => [
      {
        type: TableCellTypes.ProfileCell,
        hasAvatar: true,
        primaryText: brand.name,
        secondaryText: brand.id,
        src: brand.avatar,
        alt: brand.name,
        onclick: () => goToBrandDetails(brand.id),
      },
      {
        type: TableCellTypes.StatusCell,
        status: brand.active ? 'Online' : 'Offline',
        color: brand.active ? 'success' : 'dark',
      },
      {
        type: TableCellTypes.TextCell,
        text: brand.seoTitle || '-',
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

export default BrandList;
