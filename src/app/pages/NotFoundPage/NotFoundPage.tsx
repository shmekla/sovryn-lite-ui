import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainTemplate from '../../template/MainTemplate';

function NotFoundPage() {
  return (
    <MainTemplate>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <main>
        <div className="container">

          <h1>Not Found</h1>
          <p>Page not found.</p>

        </div>
      </main>
    </MainTemplate>
  );
}

export default NotFoundPage;
