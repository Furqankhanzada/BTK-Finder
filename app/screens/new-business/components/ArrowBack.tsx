import React from 'react';
import { Icon } from '@components';

type Props = {
  show: boolean;
};

const ArrowBack = ({ show }: Props) => {
  return show ? (
    <Icon name="arrow-left" size={20} color="#5dade2" enableRTL={true} />
  ) : null;
};

export default ArrowBack;
