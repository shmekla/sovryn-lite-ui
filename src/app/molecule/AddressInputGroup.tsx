import React, { useCallback } from 'react';
import cn from 'classnames';
import Input from '../atom/Input';
import { ReactComponent as ClearIcon } from 'assets/icons/close.svg';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const AddressInputGroup: React.FC<Props> = ({ value, onChange }) => {
  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.value);
    },
    [onChange],
  );

  const handleClear = useCallback(() => onChange(''), [onChange]);

  return (
    <>
      <div className='relative flex-row items-center justify-center'>
        <Input
          type='text'
          value={value}
          onChange={handleAmountChange}
          className={cn(value && 'pr-10')}
          autoComplete='off'
        />
        <button
          className={cn(
            'absolute text-white right-1 top-1 opacity-25',
            !value && 'hidden',
          )}
          onClick={handleClear}
        >
          <ClearIcon className='fill-current h-8 w-8' />
        </button>
      </div>
    </>
  );
};
