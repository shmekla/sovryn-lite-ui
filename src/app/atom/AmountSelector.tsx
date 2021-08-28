import { bignumber } from 'mathjs';
import React, { useCallback } from 'react';
import Button from './Button';

type Props = {
  balance: number | string;
  onChange: (value: number | string) => void;
};

export const AmountSelector: React.FC<Props> = ({ balance, onChange }) => {

  const handleClick = useCallback((value: number) => {
    onChange(bignumber(balance).mul(value / 100).toString());
  }, [balance, onChange]);

  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <Button type="button" text="25%" onClick={() => handleClick(25)} className="w-full" />
      <Button type="button" text="50%" onClick={() => handleClick(50)} className="w-full"  />
      <Button type="button" text="75%" onClick={() => handleClick(75)} className="w-full" />
      <Button type="button" text="100%" onClick={() => handleClick(100)} className="w-full"  />
    </div>
  );
};
