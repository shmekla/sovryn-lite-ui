import React, { useMemo } from 'react';
import { getCurrentNetwork } from 'utils/network';
import { prettyTx } from '../../utils/prettyTx';

type TransactionLinkProps = {
  tx: string;
  label?: React.ReactNode;
};

export function TransactionLink({ tx, label }: TransactionLinkProps) {
  const url = useMemo(
    () => `${getCurrentNetwork().networkExplorerUrl}/tx/${tx}`,
    [tx],
  );
  return (
    <>
      <a href={url} target="_blank" rel="noreferrer noopener">
        {label || prettyTx(tx)}
      </a>
    </>
  );
}
