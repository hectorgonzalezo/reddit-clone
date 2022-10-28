import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { func } from 'prop-types';
import { selectSubreddits } from '../store/subredditsSlice';
import { selectUser } from '../store/userSlice';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import DropDown from './DropDown';

function CommunityChooser({ onChoosing }) {
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
      <DropDown
        className="main-child"
        visible={dropdownVisible}
        closeFunc={toggleDropdown}
        testid="user-dropdown"
      >
        <h1>Your communities</h1>
        {Object.values(subreddits).map((subreddit) => (
          <React.Fragment key={`${subreddit.name}-fragment`}>
            <hr key={`${subreddit.name}-line`} />
            <a
              key={`${subreddit.name}-link`}
              onClick={chooseFromDropdown}
              data={subreddit.name}
            >
              <img
                key={`${subreddit.name}-icon`}
                src={subreddit.icon}
                alt=""
                data={subreddit.name}
                className="user-icon"
              />
              <p key={`${subreddit.name}-name`} data={subreddit.name}>
                {subreddit.name}
              </p>
            </a>
          </React.Fragment>
        ))}
      </DropDown>
    </div>
  );
}

CommunityChooser.propTypes = {
  onChoosing: func.isRequired,
};

export default CommunityChooser;
