import React, { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import { TableCells, TableCellTypes } from './TableCells';
import { BadgeColor } from '../ui/badge/Badge';
import EmptySection from '../example/EmptySection';

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[][];
  isEmpty?: boolean;
  headingData: string[];
}

const BasicTableView: FC<TableProps> = ({
  tableData,
  headingData,
  isEmpty,
}) => {
  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='max-w-full overflow-x-auto'>
        <div className='min-w-[1102px]'>
          <Table>
            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
              <TableRow>
                {Array.isArray(headingData) &&
                  headingData.map((heading) => (
                    <TableCell
                      key={heading}
                      isHeader
                      className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                    >
                      {heading}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}

            {!isEmpty && (
              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {Array.isArray(tableData) &&
                  tableData.map((order, index) => (
                    <TableRow key={index}>
                      {order.map((cell, cellIndex) => {
                        return cell.type === TableCellTypes.ProfileCell ? (
                          <TableCells.ProfileCell {...cell} key={cellIndex} />
                        ) : cell.type === TableCellTypes.TextCell ? (
                          <TableCells.TextCell {...cell} key={cellIndex} />
                        ) : cell.type === TableCellTypes.StatusCell ? (
                          <TableCells.StatusCell
                            color={cell.color as BadgeColor}
                            status={cell.status}
                            key={cellIndex}
                          />
                        ) : null;
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
          { isEmpty && <EmptySection
            heading='No Variants'
            description='No variants created yet.'
          />}
        </div>
      </div>
    </div>
  );
};

export default BasicTableView;
