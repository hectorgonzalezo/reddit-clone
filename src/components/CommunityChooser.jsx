import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import { selectUser } from '../store/userSlice';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import DropDown from './DropDown';

function CommunityChooser() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const subreddits = useSelector(selectSubreddits);
  const user = useSelector(selectUser);

  console.log(subreddits)

  function toggleDropdown() {
    setDropdownVisible((prev) => !prev)
  }

  return (
    <div className="main-child" id="community-chooser">
      <button
        type="button"
        className="button-show-drop-down"
        onClick={toggleDropdown}
      >
        <h1>Choose a community</h1>
        <img src={arrowDownIcon} alt="" className="icon" />
      </button>
      <DropDown
        className="main-child"
        visible={dropdownVisible}
        closeFunc={toggleDropdown}
        data-testid="user-dropdown"
      >
      <h1>Your communities</h1>
        {Object.values(subreddits).map((subreddit) => (
          <>
          <hr />
            <a>
              <img src={subreddit.icon} alt="" className="user-icon" />
              <p>{subreddit.name}</p>
            </a>
          </>
        ))}
      </DropDown>
    </div>
  );
}

export default CommunityChooser;
