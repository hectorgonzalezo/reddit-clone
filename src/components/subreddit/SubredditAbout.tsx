import React from 'react';
import { objectOf, string, number, oneOfType, bool, array } from 'prop-types';
import { format } from 'date-fns';
import SubredditIcon from '../SubredditIcon';
import cakeIcon from '../../assets/cake_icon.svg';
import formatUpvotes from '../../utils/formatUpVotes';

function SubredditAbout({ subreddit, post }) {
  return (
    <div className="main-child" id="subreddit-about">
      <div>
        {post ? (
          <>
            {/* <img src={subreddit.icon} alt="" /> */}
            <SubredditIcon icon={subreddit.icon} subredditName={subreddit.name} />
            <h1>{`r/${subreddit.name}`}</h1>
          </>
        ) : (
          <h1>About community</h1>
        )}
      </div>
      <div>
        <h1>{subreddit.description}</h1>
        <img src={cakeIcon} alt="" className="icon" />
        <p>
          Created on
          {"  "}
          {format(new Date(subreddit.dateCreated), "dd MMM yyyy")}
        </p>
      </div>
      <hr />
      <div id="members-div">
        <h1 data-testid="members-num">{formatUpvotes(subreddit.members)}</h1>
        <p>Members</p>
      </div>
    </div>
  );
}

SubredditAbout.defaultProps = {
  post: false,
}

SubredditAbout.propTypes = {
  subreddit: objectOf(oneOfType([string, number, array])).isRequired,
  post: bool,
};

export default SubredditAbout;
