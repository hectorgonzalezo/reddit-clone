import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { selectSubreddits } from '../store/subredditsSlice';
import { selectUser } from '../store/userSlice';
import JoinButton from './subreddit/Joinbutton';
import carretUpIcon from '../assets/carret_up_icon.svg';
import '../styles/topCommunitiesBarStyle.scss';

function TopCommunitiesBar(): JSX.Element {
  const subreddits = useSelector(selectSubreddits);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // sorts subreddits by number of posts
  function getTopSubreddits(number = 5): ICommunity[] {
    const sortedSubreddits = Object.values(subreddits).sort(
      (a, b) => a.postsQuantity + b.postsQuantity
    );
    const firstNumSubreddits = sortedSubreddits.slice(0, number);
    return firstNumSubreddits;
  }
  return (
    <aside
      id="top-communities-bar"
      className="main-child"
      aria-label="top communitites"
    >
      <div id="title-communities-bar">
        <div>
          <h1>Top Communities</h1>
        </div>
      </div>
      <div id="list-communities-bar">
        <ol>
          {getTopSubreddits(5).map((subreddit, i) => (
            <li key={`${subreddit.name}-item`}>
              <Link to={`r/${subreddit.name}`} key={`${subreddit.name}-link`}>
                {i + 1}
                <img
                  src={carretUpIcon}
                  alt=""
                  className="icon"
                  key={`${subreddit.name}-icon`}
                />
                {`r/${subreddit.name}`}
              </Link>
              {user.username !== undefined ? (
                <JoinButton
                  subreddit={subreddit.name}
                  key={`${subreddit.name}-join-button`}
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <div id="buttons-communities-bar">
        <Button text="View all" onClick={() => navigate("/allSubreddits")} />
      </div>
    </aside>
  );
}

export default TopCommunitiesBar;
