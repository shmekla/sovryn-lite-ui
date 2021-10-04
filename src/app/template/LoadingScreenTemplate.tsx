import React, { FC } from 'react';
import { ReactComponent as Logo } from 'assets/logo.svg';

const LoadingScreenTemplate: FC = () => (
  <div className='w-screen h-screen flex flex-col justify-center items-center'>
    <Logo className='w-24 h-24 mb-4' />
    <p>Loading...</p>
  </div>
);

export default LoadingScreenTemplate;
