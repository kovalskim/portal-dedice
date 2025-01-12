import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

type OrdersIconProps = {
  sortOrder: 'asc' | 'desc' | 'default';
};

export const OrdersIcon: React.FC<OrdersIconProps> = ({ sortOrder }) => {
  if (sortOrder === 'asc') {
    return <ArrowUpIcon ml={2} />;
  }

  if (sortOrder === 'desc') {
    return <ArrowDownIcon ml={2} />;
  }

  return (
    <>
      <ArrowUpIcon ml={2} />
      <ArrowDownIcon />
    </>
  );
};
