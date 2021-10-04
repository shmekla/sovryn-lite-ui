import React from 'react';
import { TransactionLink } from '../atom/TransactionLink';

type TransactionBadgeProps = {
  tx: string;
};

export function TransactionBadge({ tx }: TransactionBadgeProps) {
  return <TransactionLink tx={tx} />;
}
