'use client';

import React, { FC } from 'react';
import BasicTableView from './BasicTableView';
import Pagination from './Pagination';
import { TableCellTypes } from './TableCells';

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
      }
    | {
        type: TableCellTypes;
        text: string | number;
        hasAvatar?: undefined;
        primaryText?: undefined;
        secondaryText?: undefined;
        status?: undefined;
        color?: undefined;
      }
    | {
        type: TableCellTypes;
        status: string;
        color: string;
        hasAvatar?: undefined;
        primaryText?: undefined;
        secondaryText?: undefined;
        text?: undefined;
      }
  )[][];
  headingData: string[];
  pageProps?: {
    totalHitsCount?: number;
    currentPage?: number;
    pageSize?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}

const BasicTableOne: FC<BasicTableOneProps> = ({ tableData, headingData, pageProps }) => {
  return (
    <>
      <BasicTableView tableData={tableData} headingData={headingData} />
      <Pagination
        currentPage={(pageProps?.currentPage || 0) + 1}
        onPageChange={(page) => console.log(page)}
        totalPages={pageProps?.totalPages || 0}
        hasNext={pageProps?.hasNext || false}
        hasPrevious={pageProps?.hasPrevious || false}
      />
    </>
  );
};

export default BasicTableOne;
