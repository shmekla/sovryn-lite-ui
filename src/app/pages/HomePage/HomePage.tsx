import React from 'react';
import { Helmet } from 'react-helmet-async';
import FeatureItem from 'app/atom/FeatureItem';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Homepage</title>
      </Helmet>
      <main>
        <div className='container'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <FeatureItem
              to='/lend'
              title='Lend'
              description='Lend your crypto to the protocol for some annual returns.'
            />
            <FeatureItem
              to='/borrow'
              title='Borrow'
              description='Borrow some crypto by providing collateral.'
            />
            <FeatureItem
              to='/pool'
              title='Pool'
              description='Provide liquidity to automatic marker maker.'
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default HomePage;
