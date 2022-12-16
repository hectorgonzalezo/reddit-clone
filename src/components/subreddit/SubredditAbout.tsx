import React from 'react';
import { format } from 'date-fns';
import SubredditIcon from '../SubredditIcon';
import cakeIcon from '../../assets/cake_icon.svg';
import formatUpvotes from '../../utils/formatUpVotes';
import defaultCommunityIcon from '../../defaultCommunityIcon';

interface SubredditAboutProps {
  subreddit: ICommunity;
  post?: boolean;
};

function SubredditAbout({
  subreddit,
  post = false,
}: SubredditAboutProps): JSX.Element {
  return (
    <div className="main-child" id="subreddit-about">
      <div>
        {post ? (
          <>
            {/* <img src={subreddit.icon} alt="" /> */}
            <SubredditIcon
              icon={subreddit.icon === undefined? defaultCommunityIcon : subreddit.icon}
              subredditName={subreddit.name}
            />
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
          {format(new Date(subreddit.createdAt), "dd MMM yyyy")}
        </p>
      </div>
      <hr />
      <div id="members-div">
        <h1 data-testid="members-num">{formatUpvotes(subreddit.membersQuantity)}</h1>
        <p>Members</p>
      </div>
    </div>
  );
}


export default SubredditAbout;
