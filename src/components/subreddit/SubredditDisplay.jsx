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
import CreatePostPreview from '../CreatePostPreview';
import { authorization } from '../../firebase/firebase';
import { changeCurrentSubreddit } from '../../store/currentSubredditSlice';
import '../../styles/subredditStyle.scss';

function SubredditDisplay() {
  const subredditsData = useSelector(selectSubreddits);
  const { name } = useParams();
  const [chosenSubreddit, setChosenSubreddit] = useState();
  const [postsOrder, setPostsOrder] = useState('hot');
  const dispatch = useDispatch();

  function changeOrder(newOrder) {
    setPostsOrder(newOrder);
  }

  useEffect(() => {
    setChosenSubreddit(subredditsData[name]);
    dispatch(changeCurrentSubreddit(name));
  }, [subredditsData]);

  return (
    <>
      {chosenSubreddit !== undefined ? <SubredditBanner subreddit={chosenSubreddit} /> : null}
      <div id="left-side">
        {authorization.isUserSignedIn() ? <CreatePostPreview /> : null}
        <PopularPostsBar changeOrder={changeOrder}/>
        {chosenSubreddit !== undefined ? <PostsArea subreddits={[chosenSubreddit]} order={postsOrder} /> : null}
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
