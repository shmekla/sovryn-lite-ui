import React from 'react';
import { Link } from 'react-router-dom';

export default function HeaderNavigation() {
  return (
    <nav className="hidden sm:block">
      <ul className="flex justify-start items-center space-x-6">
        <li><Link to="/" className="text-blue-400 dark:text-white dark:opacity-75 transition duration-300 hover:text-blue-200">Home</Link></li>
        <li><Link to="/lend" className="dark:text-white opacity-75 transition duration-300 hover:text-blue-200">Lend</Link></li>
        <li><Link to="/borrow" className="dark:text-white opacity-75 transition duration-300 hover:text-blue-200">Borrow</Link></li>
        <li><Link to="/pool" className="dark:text-white opacity-75 transition duration-300 hover:text-blue-200">Pool</Link></li>
      </ul>
    </nav>
  );
}
