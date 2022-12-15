import React, { useState, useEffect } from 'react';
import { objectOf, number, string, oneOfType, array } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import JoinButton from './Joinbutton';

function SubredditBanner({ subreddit }) {
  const user = useSelector(selectUser);

  return (
    <div id="subreddit-banner" className="main-child">
      <img src={subreddit.icon} alt="" />
      <h1>{subreddit.subtitle}</h1>
      <p>{`r/${subreddit.name}`}</p>
      {user.subreddits !== undefined ? <JoinButton subreddit={subreddit.name} /> : null}
    </div>
  );
}

SubredditBanner.propTypes = {
  subreddit: objectOf(oneOfType([array, number, string])).isRequired,
};

export default SubredditBanner;
