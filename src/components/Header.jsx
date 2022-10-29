import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { func, bool } from 'prop-types';
import logo from '../assets/Reddit_Mark_OnWhite.png';
import logotype from '../assets/Reddit_Logotype_OnWhite.png';
import homeIcon from '../assets/home_icon.svg';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import Button from './Button';
import SearchBar from './SearchBar';
import AccountDropDown from './AccountDropDown';
import { selectUser } from '../store/userSlice';

import '../styles/headerStyle.scss';

function Header({ signUpFunc, logInFunc, opaque }) {
  // gets user from redux store
  const user = useSelector(selectUser);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);

  return (
    <header className={opaque ? 'opaque' : ''}>
      <div id="logos">
        <Link to="/">
          <img src={logo} alt="reddit logo" />
          <img src={logotype} alt="reddit logotype" />
        </Link>
      </div>
      <div id="go-to">
        <button type="button" className="button-show-drop-down">
          <img src={homeIcon} alt="home icon" className="icon" />
          <h1>Home</h1>
          <img src={arrowDownIcon} alt="" className="icon" />
        </button>
      </div>
      <SearchBar />
      <div id="user-area" data-testid="user-area">
        {/* show sign up and log in button if theres no user logged in */}
        {user.username === undefined ? (
          <>
            <Button text="Sign Up" light onClick={signUpFunc} />
            <Button text="Log In" onClick={logInFunc} />
          </>
        ) : (
          <>
            <button
              type="button"
              className="button-show-drop-down"
              onClick={() => setUserDropdownVisible((prev) => !prev)}
            >
              <img src={user.icon} alt="user icon" className="icon user-icon" />
              <p>{user.username}</p>
              <img src={arrowDownIcon} alt="" className="icon" />
            </button>
            <AccountDropDown
              userIcon={user.icon}
              visible={userDropdownVisible}
              closeFunc={() => setUserDropdownVisible(false)}
            />
          </>
        )}
      </div>
    </header>
  );
}

Header.defaultProps = {
  signUpFunc: () => {},
  logInFunc: () => {},
  opaque: false,
};

Header.propTypes = {
  signUpFunc: func,
  logInFunc: func,
  opaque: bool,
};

export default Header;
