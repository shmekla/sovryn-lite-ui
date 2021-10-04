import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AppContextProvider } from './context/app-context';
import { NotFoundPage } from './app/pages/NotFoundPage/Loadable';
import { HomePage } from './app/pages/HomePage/Loadable';
import { LendPage } from './app/pages/LendPage/Loadable';

export default function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate='%s | Defray' />
      <AppContextProvider>
        <Router>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/lend' component={LendPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </AppContextProvider>
    </HelmetProvider>
  );
}
