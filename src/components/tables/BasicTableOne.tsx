'use client';

import React, { FC } from 'react';
import BasicTableView from './BasicTableView';
import Pagination from './Pagination';
import { TableCellTypes } from './TableCells';
import { useRouter } from 'next/navigation';

interface BasicTableOneProps {
  tableData: (
    | {
        type: TableCellTypes;
        hasAvatar: boolean;
        primaryText: string;
        secondaryText: string;
        text?: undefined;
        status?: undefined;
        color?: undefined;
        onclick?: () => void;
      }
    | {
        type: TableCellTypes;
        text: string | number;
        hasAvatar?: undefined;
        primaryText?: undefined;
        secondaryText?: undefined;
        status?: undefined;
        color?: undefined;
        onclick?: () => void;
      }
    | {
        type: TableCellTypes;
        status: string;
        color: string;
        hasAvatar?: undefined;
        primaryText?: undefined;
        secondaryText?: undefined;
        text?: undefined;
        onclick?: () => void;
      }
  )[][];
  headingData: string[];
  isEmpty?: boolean;
  pageProps?: {
    totalHitsCount?: number;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}

const BasicTableOne: FC<BasicTableOneProps> = ({
  tableData,
  headingData,
  pageProps,
  isEmpty,
}) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.toString());
  };

  return (
    <>
      <BasicTableView
        tableData={tableData}
        headingData={headingData}
        isEmpty={isEmpty}
      />
      {!isEmpty && (
        <Pagination
          currentPage={(pageProps?.currentPage || 0) + 1}
          totalPages={pageProps?.totalPages || 0}
          hasNext={pageProps?.hasNext || false}
          hasPrevious={pageProps?.hasPrevious || false}
          handlePageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default BasicTableOne;
