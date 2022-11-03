import React from 'react';
import { bool, func } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../../store/subredditsSlice';
import DropDown from '../DropDown';

function SubredditsDropDown({ dropdownVisible, toggleDropdown, chooseFromDropdown }) {
  const subreddits = useSelector(selectSubreddits);

  return (
    <DropDown
      className="main-child"
      visible={dropdownVisible}
      closeFunc={toggleDropdown}
      testid="subreddits-dropdown"
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
  );
}

export default SubredditsDropDown;

SubredditsDropDown.propTypes = {
  dropdownVisible: bool.isRequired,
  toggleDropdown: func.isRequired,
  chooseFromDropdown: func.isRequired,
}