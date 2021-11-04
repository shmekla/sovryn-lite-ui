import React from 'react';
import { ReactComponent as Logo } from 'assets/logo.svg';
import HeaderNavigation from '../atom/HeaderNavigation';
import UserWalletContainer from './UserWalletContainer';
import RequestUpdateButton from './RequestUpdateButton';
import { Link } from 'react-router-dom';
// import { ReactComponent as Moon } from '../../assets/icons/moon.svg';

export default function Header() {
  // // todo move themes to component.
  // const isDarkPreferred = useCallback(() => {
  //   if (window.matchMedia) {
  //     if(window.matchMedia('(prefers-color-scheme: dark)').matches){
  //       return true;
  //     }
  //   }
  //   return false;
  // }, []);
  //
  // const [dark, setDark] = useState(isDarkPreferred());
  //
  // useEffect(() => {
  //   if(window.matchMedia) {
  //     const setPreferred = () => {
  //       setDark(isDarkPreferred());
  //     };
  //     const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //     colorSchemeQuery.addEventListener('change', setPreferred);
  //     return () => colorSchemeQuery.removeEventListener('change', setPreferred)
  //   }
  // }, [isDarkPreferred]);
  //
  // const changeTheme = useCallback(() => {
  //   setDark(prevState => !prevState);
  // }, []);
  //
  // useEffect(() => {
  //   if (dark) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [dark]);

  return (
    <header className="mb-12 flex-grow-0 flex-shrink-0">
      <div className="container py-3">
        <div className="flex space-x-8 justify-between items-center">
          <div className="flex justify-start items-center space-x-8">
            <Link to="/">
              <Logo className="w-12 h-12 " />
            </Link>
            <HeaderNavigation />
          </div>
          <div className="flex flex-row space-x-4 justify-end items-center z-20">
            <UserWalletContainer />
            <RequestUpdateButton />
            {/*<button onClick={changeTheme}><Moon className="fill-current text-black dark:text-white" /></button>*/}
          </div>
        </div>
      </div>
    </header>
  );
}
