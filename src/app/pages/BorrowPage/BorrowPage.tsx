import React, { useContext, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { listLoanTokens } from 'utils/helpers';
import { BorrowPool } from './components/BorrowPool';
import AppContext from '../../../context/app-context';
import AppProvider from '../../../utils/AppProvider';

const BorrowPage: React.FC = () => {
  const { address } = useContext(AppContext);

  const loanPools = useMemo(
    () => listLoanTokens().filter(item => item.collateralTokens.length),
    [],
  );

  useEffect(() => {
    AppProvider.requestUpdate();
  }, [address]);

  return (
    <>
      <Helmet>
        <title>Borrow</title>
      </Helmet>
      <main>
        <div className="container">
          <h1>Borrow</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loanPools.map(pool => (
              <BorrowPool key={pool.token} {...pool} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default BorrowPage;
