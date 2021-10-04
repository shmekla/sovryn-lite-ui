import React, { useMemo } from 'react';
import { getCurrentNetwork } from 'utils/network';
import { prettyTx } from '../../utils/prettyTx';

type AddressLinkProps = {
  address: string;
  label?: React.ReactNode;
};

export function AddressLink({ address, label }: AddressLinkProps) {
  const url = useMemo(
    () => `${getCurrentNetwork().networkExplorerUrl}/address/${address}`,
    [address],
  );
  return (
    <>
      <a href={url} target='_blank' rel='noreferrer noopener'>
        {label || prettyTx(address)}
      </a>
    </>
  );
}
