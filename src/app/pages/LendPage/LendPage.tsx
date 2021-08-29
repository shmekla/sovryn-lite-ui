import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { listLoanTokens } from 'utils/helpers';
import { Nullable } from 'types/nullable';
import { TOKEN } from 'types/token';
import MainTemplate from '../../template/MainTemplate';
import { LendingPool } from './components/LendingPool';
import LendDialog from './components/LendDialog';
import AppContext from '../../../context/app-context';
import walletService from '../../../utils/walletService';
import UnlendDialog from './components/UnlendDialog';
import AppProvider from '../../../utils/AppProvider';

function LendPage() {

  const { connected, address } = useContext(AppContext);

  const [dialogs, setDialogs] = useState<{ token: Nullable<TOKEN>; lend: boolean; unlend: boolean; }>({ token: null, lend: false, unlend: false });

  const loanPools = useMemo(() => listLoanTokens(), []);

  const openLend = useCallback(async (token: TOKEN) => {
    if (!connected) {
      await walletService.connect();
    }
    setDialogs(prevState => ({...prevState, token, lend: true, unlend: false }));
  }, [connected]);

  const openUnlend = useCallback(async (token: TOKEN) => {
    if (!connected) {
      await walletService.connect();
    }
    setDialogs(prevState => ({...prevState, token, unlend: true, lend: false }));
  }, [connected]);

  const closeDialog = useCallback(() => {
    setDialogs(prevState => ({...prevState, token: null, lend: false, unlend: false }));
  }, []);

  useEffect(() => {
    console.log('request update');
    AppProvider.requestUpdate();
  }, [address]);

  return (
    <MainTemplate>
      <Helmet>
        <title>Lend</title>
      </Helmet>
      <main>
        <div className="container">

          <h1>Lend</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loanPools.map(pool => <LendingPool key={pool.token} {...pool} onLend={openLend} onUnlend={openUnlend} />)}
          </div>

          <LendDialog pool={dialogs.token!} isOpen={dialogs.lend} onClose={closeDialog} />
          <UnlendDialog pool={dialogs.token!} isOpen={dialogs.unlend} onClose={closeDialog} />
        </div>
      </main>
    </MainTemplate>
  );
}

export default LendPage;
