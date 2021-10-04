import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AppContextProvider } from './context/app-context';
import { NotFoundPage } from './app/pages/NotFoundPage/Loadable';
// import { HomePage } from './app/pages/HomePage/Loadable';
import { LendPage } from './app/pages/LendPage/Loadable';
import { WalletPage } from './app/pages/WalletPage/Loadable';
import LoadingScreenTemplate from './app/template/LoadingScreenTemplate';
import MainTemplate from './app/template/MainTemplate';

export default function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate='%s | Defray' />
      <AppContextProvider>
        <React.Suspense fallback={<LoadingScreenTemplate />}>
          <Router>
            <MainTemplate>
              <Switch>
                <Route exact path='/' component={LendPage} />
                <Route exact path='/lend' component={LendPage} />
                <Route exact path='/wallet' component={WalletPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </MainTemplate>
          </Router>
        </React.Suspense>
      </AppContextProvider>
    </HelmetProvider>
  );
}
