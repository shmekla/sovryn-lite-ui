import React, { useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { listLoanTokens } from 'utils/helpers';
import { Nullable } from 'types/nullable';
import { TOKEN } from 'types/token';
import MainTemplate from '../../template/MainTemplate';
import { LendingPool } from './components/LendingPool';
import { Dialog } from '../../molecule/Dialog';

function LendPage() {

  const [dialogs, setDialogs] = useState<{ token: Nullable<TOKEN>; lend: boolean; unlend: boolean; }>({ token: null, lend: false, unlend: false });

  const loanPools = useMemo(() => listLoanTokens(), []);

  const openLend = useCallback((token: TOKEN) => {
    setDialogs(prevState => ({...prevState, token, lend: true, unlend: false }));
  }, []);

  const openUnlend = useCallback((token: TOKEN) => {
    setDialogs(prevState => ({...prevState, token, unlend: true, lend: false }));
  }, []);

  const closeDialog = useCallback(() => {
    setDialogs(prevState => ({...prevState, token: null, lend: false, unlend: false }));
  }, []);

  return (
    <MainTemplate>
      <Helmet>
        <title>Lend</title>
      </Helmet>
      <main>
        <div className="container">

          <h1>Lend</h1>

          <div className="grid grid-cols-3 gap-8">
            {loanPools.map(pool => <LendingPool key={pool.token} {...pool} onLend={openLend} onUnlend={openUnlend} />)}
          </div>


          <Dialog isOpen={dialogs.lend} onClose={closeDialog}>
            <>
              <div className="w-24 h-48">item</div>
              <div className="w-24 h-48">item</div>
              <div className="w-24 h-48">item</div>
            </>
          </Dialog>
        </div>
      </main>
    </MainTemplate>
  );
}

export default LendPage;
