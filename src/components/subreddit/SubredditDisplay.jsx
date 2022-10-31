import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../../store/subredditsSlice';
import SubredditBanner from './SubredditBanner';
import PopularPostsBar from '../PopularPostsBar';
import PostsArea from '../post/PostsArea';
import Button from '../Button';
import SubredditAbout from './SubredditAbout';
import Agreements from '../Agreements';
import '../../styles/subredditStyle.scss';

function SubredditDisplay() {
  const subredditsData = useSelector(selectSubreddits);
  const subreddit = useParams();
  const [chosenSubreddit, setChosenSubreddit] = useState(subredditsData[subreddit.name]);

  useEffect(() => {
    setChosenSubreddit(subredditsData[subreddit.name]);
  }, [subredditsData]);

  return (
    <>
      <div id="top-side">
        {chosenSubreddit !== undefined ? <SubredditBanner subreddit={chosenSubreddit} /> : null}
      </div>
      <div id="left-side">
        <PopularPostsBar />
        {chosenSubreddit !== undefined ? <PostsArea subreddits={[chosenSubreddit]} /> : null}
      </div>
      <div id="right-side">
        {chosenSubreddit !== undefined ? <SubredditAbout subreddit={chosenSubreddit} /> : null}
        <Agreements />
        <Button text="Back to Top" />
      </div>
    </>
  );
}

export default SubredditDisplay;
