import React from 'react';
import { objectOf, string, number, oneOfType } from 'prop-types';
import { format } from 'date-fns';

function SubredditAbout({ subreddit }) {
  return (
    <div className="main-child" id="subreddit-about">
      <div>
        <h1>About community</h1>
      </div>
      <div>
        <p>{subreddit.description}</p>
        <p>
          Created on
          {'  '}
          {format(new Date(subreddit.dateCreated), 'dd MMM yyyy')}
        </p>
      </div>
      <div>
        <h1>{subreddit.members}</h1>
        <p>Members</p>
      </div>
    </div>
  );
}

SubredditAbout.propTypes = {
  subreddit: objectOf(oneOfType([string, number])).isRequired,
};

export default SubredditAbout;
