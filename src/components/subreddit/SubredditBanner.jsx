import React from 'react';
import { objectOf, number, string, oneOfType } from 'prop-types';
import Button from '../Button';

function SubredditBanner({ subreddit }) {
  return (
    <div id="subreddit-banner" className="main-child">
      <img src={subreddit.icon} alt="" />
      <h1>{subreddit.subtitle}</h1>
      <h2>{subreddit.name}</h2>
      <Button text="Join" />
    </div>
  );
}

SubredditBanner.propTypes = {
  subreddit: objectOf(oneOfType([number, string])).isRequired,
};

export default SubredditBanner;
