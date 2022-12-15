import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { bool, func } from 'prop-types';
import { selectSubreddits } from '../store/subredditsSlice';
import { selectUser } from '../store/userSlice';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import SubredditsDropDown from './subreddit/SubredditsDropDown';

function CommunityChooser({ onChoosing, header }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const subreddits = useSelector(selectSubreddits);

  const [chosenSubreddit, setChosenSubreddit] = useState(null);

  function toggleDropdown() {
    setDropdownVisible((prev) => !prev);
  }

  // chooses subreddit from dropdown
  function chooseFromDropdown(e) {
    const subredditName = e.target.getAttribute('data');
    setChosenSubreddit(subredditName);
    onChoosing(subredditName);
  }

  return (
    <div className="main-child" id="community-chooser">
      <button
        type="button"
        className="button-show-drop-down"
        onClick={toggleDropdown}
      >
        <img
          src={
            chosenSubreddit !== null ? subreddits[chosenSubreddit].icon : null
          }
          alt=""
          className="user-icon"
        />
        <h1 data-testid="community-chooser-title">
          {chosenSubreddit !== null
            ? subreddits[chosenSubreddit].name
            : "Choose a community"}
        </h1>
        <img src={arrowDownIcon} alt="" className="icon" />
      </button>
      <SubredditsDropDown dropdownVisible={dropdownVisible} toggleDropdown={toggleDropdown} chooseFromDropdown={chooseFromDropdown} />
    </div>
  );
}

CommunityChooser.defaultProps = {
  header: false,
}

CommunityChooser.propTypes = {
  onChoosing: func.isRequired,
  header: bool,
};

export default CommunityChooser;
