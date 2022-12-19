import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { getSubreddit } from '../api/communities';

import '../styles/headerStyle.scss';
import { selectSubreddits } from '../store/subredditsSlice';

interface HeaderProps {
  signUpFunc: () => void,
  logInFunc: () => void,
  opaque: boolean,
};

function Header({
  signUpFunc = () => {},
  logInFunc = () => {},
  opaque = false,
}: HeaderProps): JSX.Element {
  // gets user from redux store
  const user = useSelector(selectUser);
  const subreddits = useSelector(selectSubreddits);
  const currentSubreddit = useSelector(selectCurrentSubreddit);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [subredditDropdownVisible, setSubredditDropdownVisible] =
    useState(false);
  const [subredditIcon, setSubredditIcon] = useState(homeIcon);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function toggleSubredditDropdown(): void {
    setSubredditDropdownVisible((prev) => !prev);
  }

  async function navigateToSubreddit(e: SyntheticEvent): Promise<void> {
    const target = e.target as HTMLAnchorElement;
    const subredditName = target.getAttribute("data-name") as string;

    dispatch(changeCurrentSubreddit(subredditName));
    navigate(`/r/${subredditName}`);
  }

  // closes subreddits and user dropdowns when mouse leaves the header area
  function closeAllDropDowns(): void {
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
      const currentSubredditId = subreddits[currentSubreddit]._id.toString();
      getSubreddit(currentSubredditId)
        .then((data) => {
          if (data.community.icon !== undefined) {
            setSubredditIcon(data.community.icon);
          }
        })
        .catch((error) => console.log(error));
    } else {
      setSubredditIcon(homeIcon);
    }
  }, [currentSubreddit]);

  return (
    <header className={opaque ? "opaque" : ""} onMouseLeave={closeAllDropDowns}>
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
            <img
              src={subredditIcon}
              alt="chosen subreddit"
              className={subredditIcon === homeIcon ? "icon" : "user-icon"}
            />
            <h1>{currentSubreddit === null ? "Home" : currentSubreddit}</h1>
            <img src={arrowDownIcon} className="icon" alt="" aria-hidden="true" />
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
              userIcon={user.icon !== undefined ? user.icon : ''}
              visible={userDropdownVisible}
              closeFunc={() => setUserDropdownVisible(false)}
            />
          </>
        )}
      </div>
    </header>
  );
}


export default Header;
