import React from 'react';
import { objectOf, string, number, oneOfType } from 'prop-types';
import { format } from 'date-fns';
import cakeIcon from '../../assets/cake_icon.svg';
import formatUpvotes from '../../utils/formatUpVotes';

function SubredditAbout({ subreddit }) {
  return (
    <div className="main-child" id="subreddit-about">
      <div>
        <h1>About community</h1>
      </div>
      <div>
        <h1>{subreddit.description}</h1>
        <img src={cakeIcon} alt="" className="icon" />
        <p>
          Created on
          {'  '}
          {format(new Date(subreddit.dateCreated), 'dd MMM yyyy')}
        </p>
      </div>
      <hr />
      <div id="members-div">
        <h1>{formatUpvotes(subreddit.members)}</h1>
        <p>Members</p>
      </div>
    </div>
  );
}

SubredditAbout.propTypes = {
  subreddit: objectOf(oneOfType([string, number])).isRequired,
};

export default SubredditAbout;
