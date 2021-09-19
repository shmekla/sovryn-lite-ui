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
import { LendingInfoResponse } from '../../../utils/blockchain/liquidityMining';

function LendPage() {

  const { connected, address } = useContext(AppContext);

  const [dialogs, setDialogs] = useState<{ token: Nullable<TOKEN>; state: Nullable<LendingInfoResponse>, lend: boolean; unlend: boolean; }>({ token: null, state: null, lend: false, unlend: false });

  const loanPools = useMemo(() => listLoanTokens(), []);

  const openLend = useCallback(async (token: TOKEN, state: LendingInfoResponse) => {
    if (!connected) {
      await walletService.connect();
    }
    setDialogs(prevState => ({...prevState, token, state, lend: true, unlend: false }));
  }, [connected]);

  const openUnlend = useCallback(async (token: TOKEN, state: LendingInfoResponse) => {
    if (!connected) {
      await walletService.connect();
    }
    setDialogs(prevState => ({...prevState, token, state, unlend: true, lend: false }));
  }, [connected]);

  const closeDialog = useCallback(() => {
    setDialogs(prevState => ({...prevState, token: null, state: null, lend: false, unlend: false }));
  }, []);

  useEffect(() => {
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

          <LendDialog pool={dialogs.token!} state={dialogs.state!} isOpen={dialogs.lend} onClose={closeDialog} />
          <UnlendDialog pool={dialogs.token!} state={dialogs.state!} isOpen={dialogs.unlend} onClose={closeDialog} />
        </div>
      </main>
    </MainTemplate>
  );
}

export default LendPage;
