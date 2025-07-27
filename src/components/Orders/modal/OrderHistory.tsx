'use client';
import { ORDER_NORMAL_EVENTS } from '@/core/constants';
import { IOrderEventItem, IOrderEvents } from '@/core/types';
import React, { FC, Fragment } from 'react';

interface NodeProps {
  index: number;
  name: string;
  eventItem?: IOrderEventItem;
}

const Node: FC<NodeProps> = ({ index, name, eventItem }) => {
  return (
    <div className='flex flex-col items-center text-center relative'>
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full${
          eventItem?.at ? ' bg-green-800' : ' bg-gray-700'
        } text-white`}
      >
        {index}
      </div>
      <span className='mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 absolute top-9'>
        {name}
      </span>
    </div>
  );
};

interface LineProps {
  isCompleted?: boolean;
}

const Line: FC<LineProps> = ({ isCompleted }) => (
  <div className={`flex-auto border-t-2${isCompleted ? ' border-green-900' : ' border-gray-700'}  mx-2`} />
);

interface OrderHistoryProps {
  events?: IOrderEvents;
}

const OrderHistory: FC<OrderHistoryProps> = ({ events }) => {
  const items = ORDER_NORMAL_EVENTS.map((event, index) => {
    return (
      <Fragment key={event}>
        <Node
          index={index + 1}
          eventItem={events?.[event]}
          name={event}
          key={event}
        />
        {index < ORDER_NORMAL_EVENTS.length - 1 && <Line isCompleted={Boolean(events?.[event])} />}
      </Fragment>
    );
  });
  return (
    <div className='hidden md:block w-full px-4 py-6 bg-white border dark:border-gray-700 dark:bg-gray-800 rounded-xl mb-4 pb-12'>
      <div className='flex justify-between items-center px-5 flex-wrap'>{items}</div>
    </div>
  );
};

export default OrderHistory;
