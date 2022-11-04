import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { func, bool } from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/Reddit_Mark_OnWhite.png';
import logotype from '../assets/Reddit_Logotype_OnWhite.png';
import homeIcon from '../assets/home_icon.svg';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import Button from './Button';
import SearchBar from './SearchBar';
import AccountDropDown from './AccountDropDown';
import SubredditsDropDown from './subreddit/SubredditsDropDown';
import { selectUser } from '../store/userSlice';
import { selectCurrentSubreddit, changeCurrentSubreddit } from '../store/currentSubredditSlice';
import { database } from '../firebase/firebase';

import '../styles/headerStyle.scss';

function Header({ signUpFunc, logInFunc, opaque }) {
  // gets user from redux store
  const user = useSelector(selectUser);
  const currentSubreddit = useSelector(selectCurrentSubreddit);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [subredditDropdownVisible, setSubredditDropdownVisible] = useState(false);
  const [subredditIcon, setSubredditIcon] = useState(homeIcon);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  function toggleSubredditDropdown() {
    setSubredditDropdownVisible((prev) => !prev);
  }

  async function navigateToSubreddit(e) {
    const subredditName = e.target.getAttribute('data');
    dispatch(changeCurrentSubreddit(subredditName));

    // get subreddit icon
    const subredditData = await database.getSubredditData(subredditName);
    setSubredditIcon(subredditData.icon)

    navigate(`/r/${subredditName}`);
  }

  // closes subreddits and user dropdowns when mouse leaves the header area
  function closeAllDropDowns() {
    if (userDropdownVisible) {
      setUserDropdownVisible(false);
    }
    if (subredditDropdownVisible) {
      setSubredditDropdownVisible(false);
    }
  }

  useEffect(() => {
    // change subreddit icon
    if (currentSubreddit !== null) {
    database.getSubredditData(currentSubreddit)
      .then((data) => setSubredditIcon(data.icon));
    } else {
      setSubredditIcon(homeIcon)
    }
  }, [currentSubreddit]);

  return (
    <header className={opaque ? 'opaque' : ''} onMouseLeave={closeAllDropDowns}>
      <div id="logos">
        <Link to="/">
          <img src={logo} alt="reddit" />
          <img src={logotype} alt="reddit" />
        </Link>
      </div>
      {user.username !== undefined ? (
        <div id="go-to" data-testid="go-to">
          <button
            type="button"
            className="button-show-drop-down"
            onClick={toggleSubredditDropdown}
            
          >
            <img src={subredditIcon} alt="chosen subreddit" className={subredditIcon === homeIcon ? 'icon' : 'user-icon'} />
            <h1>{currentSubreddit === null ? 'Home' : currentSubreddit}</h1>
            <img src={arrowDownIcon} alt="" className="icon" />
          </button>
          <SubredditsDropDown
            dropdownVisible={subredditDropdownVisible}
            toggleDropdown={toggleSubredditDropdown}
            chooseFromDropdown={navigateToSubreddit}
            header
          />
        </div>
      ) : null}
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
