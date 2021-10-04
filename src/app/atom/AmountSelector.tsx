import { bignumber } from 'mathjs';
import React, { useCallback } from 'react';

type Props = {
  balance: number | string;
  onChange: (value: number | string) => void;
};

export const AmountSelector: React.FC<Props> = ({ balance, onChange }) => {
  const handleClick = useCallback(
    (value: number) => {
      onChange(
        bignumber(balance)
          .mul(value / 100)
          .toString(),
      );
    },
    [balance, onChange],
  );

  return (
    <div className='flex flex-row justify-between items-center space-x-2'>
      <button
        type='button'
        onClick={() => handleClick(25)}
        className='w-full rounded text-white bg-blue-900 px-2 py-1'
      >
        25%
      </button>
      <button
        type='button'
        onClick={() => handleClick(50)}
        className='w-full rounded text-white bg-blue-900 px-2 py-1'
      >
        50%
      </button>
      <button
        type='button'
        onClick={() => handleClick(75)}
        className='w-full rounded text-white bg-blue-900 px-2 py-1'
      >
        75%
      </button>
      <button
        type='button'
        onClick={() => handleClick(100)}
        className='w-full rounded text-white bg-blue-900 px-2 py-1'
      >
        100%
      </button>
    </div>
  );
};
