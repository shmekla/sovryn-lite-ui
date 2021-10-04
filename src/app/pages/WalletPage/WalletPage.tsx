import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Helmet } from 'react-helmet-async';
import log from 'loglevel';
import { listTokens, weiToLocaleNumber } from '../../../utils/helpers';
import { storage } from '../../../utils/storage';
import { AddressLink } from '../../atom/AddressLink';
import { useBalance } from '../../hooks/useBalance';
import AppContext from '../../../context/app-context';
import Spinner from '../../atom/Spinner';
import { WalletToken } from './types';
import { SendBalanceDialog } from './components/SendBalanceDialog';
import { ReactComponent as SendIcon } from 'assets/icons/send.svg';

const defaultTokens: WalletToken[] = listTokens().map(item => ({
  ...item,
  custom: false,
}));

type Props = { token: WalletToken };

const AssetRow: React.FC<Props> = ({ token }) => {
  const { address } = useContext(AppContext);
  const { value, loading } = useBalance(token.address, address, token.native);
  const [transfer, setTransfer] = useState(false);
  return (
    <>
      <div className='bg-white bg-opacity-5 px-3 py-2 flex flex-row justify-between items-center space-x-4 rounded mb-2 relative'>
        <div className='w-24'>
          <AddressLink address={token.address} label={token.symbol} />
        </div>
        <div className='flex flex-row justify-end items-center space-x-2'>
          <div className='relative'>
            {weiToLocaleNumber(value, 6, token.decimals)}{' '}
            <div
              className='absolute'
              style={{ top: '-0.25rem', right: '-0.25rem' }}
            >
              <Spinner show={loading} className='' size={8} strokeWidth={2} />
            </div>
          </div>
          <button
            onClick={() => setTransfer(true)}
            className='w-8 h-8 rounded bg-blue-300 bg-opacity-25 flex flex-row justify-center items-center'
          >
            <SendIcon className='w-4 h-4 fill-current' />
          </button>
        </div>
      </div>
      <SendBalanceDialog
        token={token}
        balance={value}
        isOpen={transfer}
        onClose={() => setTransfer(false)}
      />
    </>
  );
};

function WalletPage() {
  const [customTokens, setCustomTokens] = useState<WalletToken[]>([]);

  const loadCustomTokens = useCallback(async () => {
    const items: WalletToken[] = JSON.parse(await storage.get('tokens', '[]'));
    return items;
  }, []);

  useEffect(() => {
    loadCustomTokens().then(setCustomTokens).catch(log.error);
  }, [loadCustomTokens]);

  const tokens = useMemo(
    () => [...defaultTokens, ...customTokens],
    [customTokens],
  );

  return (
    <>
      <Helmet>
        <title>Wallet</title>
      </Helmet>
      <main>
        <div className='container'>
          {tokens.map(item => (
            <AssetRow key={item.address} token={item} />
          ))}
        </div>
      </main>
    </>
  );
}

export default WalletPage;
