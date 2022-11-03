import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits } from '../../store/subredditsSlice';
import SubredditBanner from './SubredditBanner';
import PopularPostsBar from '../PopularPostsBar';
import PostsArea from '../post/PostsArea';
import Button from '../Button';
import SubredditAbout from './SubredditAbout';
import Agreements from '../Agreements';
import { changeCurrentSubreddit } from '../../store/currentSubredditSlice';
import '../../styles/subredditStyle.scss';

function SubredditDisplay() {
  const subredditsData = useSelector(selectSubreddits);
  const subreddit = useParams();
  const [chosenSubreddit, setChosenSubreddit] = useState(subredditsData[subreddit.name]);
  const dispatch = useDispatch();

  useEffect(() => {
    setChosenSubreddit(subredditsData[subreddit.name]);
  }, [subredditsData]);

  useEffect(() => {
    dispatch(changeCurrentSubreddit(chosenSubreddit.name));
  }, [chosenSubreddit]);

  return (
    <>
      {chosenSubreddit !== undefined ? <SubredditBanner subreddit={chosenSubreddit} /> : null}
      <div id="left-side">
        <PopularPostsBar />
        {chosenSubreddit !== undefined ? <PostsArea subreddits={[chosenSubreddit]} /> : null}
      </div>
      <div id="right-side">
        {chosenSubreddit !== undefined ? <SubredditAbout subreddit={chosenSubreddit} /> : null}
        <Agreements />
        <Button text="Back to Top" onClick={() => window.scrollTo({ top: 0 })}/>
      </div>
    </>
  );
}

export default SubredditDisplay;
