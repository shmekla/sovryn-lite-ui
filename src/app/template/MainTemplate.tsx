import React, { FC } from 'react';
import Header from '../molecule/Header';
import Footer from '../molecule/Footer';

const MainTemplate: FC = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-between">
    <Header/>
    <div className="flex-grow">{children}</div>
    <Footer/>
  </div>
);

export default MainTemplate;
