import React, { useMemo } from 'react';
import { getCurrentNetwork } from 'utils/network';

type AddressLinkProps = {
  address: string;
  label?: React.ReactNode;
};

export function AddressLink({ address, label }: AddressLinkProps) {
  const url = useMemo(() => `${getCurrentNetwork().networkExplorerUrl}/address/${address}`, [address]);
  return (<><a href={url} target="_blank" rel="noreferrer noopener">{label || address}</a></>);
}
