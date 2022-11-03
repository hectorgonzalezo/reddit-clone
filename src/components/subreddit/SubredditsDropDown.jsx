import React from 'react';
import { bool, func } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../../store/subredditsSlice';
import { selectUser } from '../../store/userSlice';
import DropDown from '../DropDown';

function SubredditsDropDown({ dropdownVisible, toggleDropdown, chooseFromDropdown, header }) {
  const subreddits = useSelector(selectSubreddits);
  const user = useSelector(selectUser);

  return (
    <DropDown
      className="main-child"
      visible={dropdownVisible}
      closeFunc={toggleDropdown}
      testid="subreddits-dropdown"
    >
      <h1>Your communities</h1>
      {user.subreddits.map((subreddit) => (
        <React.Fragment key={`${subreddits[subreddit].name}-fragment`}>
          <hr key={`${subreddits[subreddit].name}-line`} />
          <a
            key={`${subreddits[subreddit].name}-link`}
            onClick={chooseFromDropdown}
            data={subreddits[subreddit].name}
          >
            <img
              key={`${subreddits[subreddit].name}-icon`}
              src={subreddits[subreddit].icon}
              alt=""
              data={subreddits[subreddit].name}
              className="user-icon"
            />
            <p key={`${subreddits[subreddit].name}-name`} data={subreddits[subreddit].name}>
              {subreddits[subreddit].name}
            </p>
          </a>
        </React.Fragment>
      ))}
      <hr />
      {header ?
      <>
      <h1>All communities</h1>
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
      </>
      : null}
    </DropDown>
  );
}

export default SubredditsDropDown;

SubredditsDropDown.defaultProps = {
  header: false,
}

SubredditsDropDown.propTypes = {
  dropdownVisible: bool.isRequired,
  toggleDropdown: func.isRequired,
  chooseFromDropdown: func.isRequired,
  header: bool,
}