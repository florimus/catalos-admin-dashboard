'use client';

import { IVariant } from '@/core/types';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import BasicTableOne from '../tables/BasicTableOne';
import { TableCellTypes } from '../tables/TableCells';

interface VariantListProps {
  hits?: IVariant[];
  totalHitsCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const VariantList: FC<VariantListProps> = ({ hits = [], ...rest }) => {
  const router = useRouter();

  const headingData: string[] = ['Variant', 'Slug', 'Status'];

  const goToVariantDetails = (variantId: string) =>
    router.push(`/variants/${variantId}`);

  const tableData =
    hits?.map((variant) => [
      {
        type: TableCellTypes.ProfileCell,
        hasAvatar: true,
        primaryText: variant.name,
        src: variant.medias?.[0]?.defaultSrc || '',
        secondaryText: variant.skuId,
        onclick: () => goToVariantDetails(variant.id),
      },
      {
        type: TableCellTypes.TextCell,
        text: variant.slug,
      },
      {
        type: TableCellTypes.StatusCell,
        status: variant.active ? 'Online' : 'Offline',
        color: variant.active ? 'success' : 'dark',
      },
    ]) || [];
  return (
    <BasicTableOne
      headingData={headingData}
      tableData={tableData}
      pageProps={rest}
      isEmpty={!hits?.length}
    />
  );
};

export default VariantList;
