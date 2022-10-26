import React from 'react';
import logo from '../assets/Reddit_Mark_OnWhite.png';
import logotype from '../assets/Reddit_Logotype_OnWhite.png';
import homeIcon from '../assets/home_icon.svg';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import userIcon from '../assets/user_icon.svg';
import Button from './Button';
import SearchBar from './SearchBar';
import { func, bool } from 'prop-types';
import { authorization } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import '../styles/headerStyle.scss';

function Header({ signUpFunc, opaque }) {
  // gets user from redux store
  const user = useSelector(selectUser);

  return (
    <header className={opaque ? 'opaque' : ''}>
      <div id="logos">
        <a>
          <img src={logo} alt="reddit logo" />
          <img src={logotype} alt="reddit logotype" />
        </a>
      </div>
      <div id="go-to">
        <button type="button">
          <img src={homeIcon} alt="" className="icon" />
          <h1>Home</h1>
          <img src={arrowDownIcon} alt="" className="icon" />
        </button>
      </div>
      <SearchBar />
      <div id="user-area">
        <Button text="Sign Up" light onClick={signUpFunc} />
        <Button text="Log In" onClick={authorization.logIn} />
        <button type="button">
          <img src={userIcon} alt="" className="icon" />
          <img src={arrowDownIcon} alt="" className="icon" />
        </button>
      </div>
    </header>
  );
}

Header.defaultProps = {
  signUpFunc: () => {},
  opaque: false,
};

Header.propTypes = {
  signUpFunc: func,
  opaque: bool,
};

export default Header;
