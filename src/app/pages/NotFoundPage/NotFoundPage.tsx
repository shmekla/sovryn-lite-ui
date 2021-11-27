import React from 'react';
import { Helmet } from 'react-helmet-async';

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <main>
        <div className="container">
          <h1>Not Found</h1>
          <p>Page not found.</p>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
