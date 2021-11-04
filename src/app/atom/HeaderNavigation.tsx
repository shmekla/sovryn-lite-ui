import React from 'react';
import { NavLink } from 'react-router-dom';

export default function HeaderNavigation() {
  return (
    <nav className="hidden sm:block">
      <ul className="flex justify-start items-center space-x-6">
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    to='/'*/}
        {/*    className='text-blue-400 dark:text-white dark:opacity-75 transition duration-300 hover:text-blue-200'*/}
        {/*  >*/}
        {/*    Home*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
        <li>
          <NavLink to="/lend" className="nav-link" exact>
            Lend
          </NavLink>
        </li>
        <li>
          <NavLink to="/borrow" className="nav-link" exact>
            Borrow
          </NavLink>
        </li>
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    to='/pool'*/}
        {/*    className='dark:text-white opacity-75 transition duration-300 hover:text-blue-200'*/}
        {/*  >*/}
        {/*    Pool*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
      </ul>
    </nav>
  );
}
