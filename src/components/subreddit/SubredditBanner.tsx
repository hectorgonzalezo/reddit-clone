import React from 'react';
import { objectOf, number, string, oneOfType, array } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import JoinButton from './Joinbutton';

interface SubredditBannerProps  {
  subreddit: ICommunity;
};

function SubredditBanner({ subreddit }: SubredditBannerProps): JSX.Element {
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



export default SubredditBanner;
