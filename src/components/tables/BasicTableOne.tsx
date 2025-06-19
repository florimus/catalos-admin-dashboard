'use client';

import React, { FC } from 'react';
import BasicTableView from './BasicTableView';
import Pagination from './Pagination';
import { useRouter } from 'next/navigation';

interface BasicTableOneProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[][];
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
