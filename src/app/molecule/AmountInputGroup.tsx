import React, { useCallback } from 'react';
import Input from '../atom/Input';
import { getToken, weiToLocaleNumber, weiToNumber } from '../../utils/helpers';
import { AmountSelector } from '../atom/AmountSelector';
import { TOKEN } from '../../types/token';

type Props = {
  value: string;
  onChange: (value: string) => void;
  maxAmount: string;
  token?: TOKEN;
  decimals?: number;
};

const AmountInputGroup: React.FC<Props> = ({ value, onChange, maxAmount, token, decimals }) => {

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  }, [onChange]);

  const handleAmountSelect = useCallback((amount: string | number) => {
    onChange(weiToNumber(amount, decimals || 8));
  }, [onChange, decimals]);

  return (<>
    <Input type="number" value={value} onChange={handleAmountChange} min={0} max={maxAmount} step={weiToNumber(1, 8, 8)} />
    <div className="mt-1 lg:mt-3 flex flex-col items-start space-y-3 lg:flex-row lg:justify-between lg:items-center lg:space-x-4 lg:space-y-0">
      <div className="text-gray-600 flex lg:self-start">{weiToLocaleNumber(maxAmount, 8)} {getToken(token!)?.symbol}</div>
      <div className="w-full lg:w-auto">
        <AmountSelector balance={maxAmount} onChange={handleAmountSelect} />
      </div>
    </div>
  </>);

};

export default AmountInputGroup;
