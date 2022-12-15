import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import { selectUser } from '../store/userSlice';
import CreatePostPreview from './CreatePostPreview';
import PopularPostsBar from './PopularPostsBar';
import TopCommunitiesBar from './TopCommunitiesBar';
import Button from './Button';
import PostsArea from './post/PostsArea';
import Agreements from './Agreements';
import uniqid from 'uniqid';
import { authorization } from '../firebase/firebase';
import { changeCurrentSubreddit } from '../store/currentSubredditSlice';

function HomePage() {
  const subredditsData = useSelector(selectSubreddits);
  const user = useSelector(selectUser);
  const [chosenSubreddits, setChosenSubreddits] = useState({});
  const [postsOrder, setPostsOrder] = useState('hot');
  const dispatch = useDispatch();

  function changeOrder(newOrder) {
    setPostsOrder(newOrder);
  }

  // update subreddits for posts area every time they change
  useEffect(() => {
    setChosenSubreddits(subredditsData);
    dispatch(changeCurrentSubreddit(null));
  }, [subredditsData]);

  return (
    <>
      <div id="left-side">
        {user.subreddits !== undefined ? <CreatePostPreview /> : null}
        <PopularPostsBar changeOrder={changeOrder} />
        <PostsArea subreddits={chosenSubreddits} order={postsOrder}/>
      </div>
      <div id="right-side">
        <TopCommunitiesBar />
        <Agreements />
        <Button text="Back to Top" onClick={() => window.scrollTo({ top: 0 })}/>
      </div>
    </>
  );
}

export default HomePage;
