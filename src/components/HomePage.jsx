import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import CreatePostPreview from './CreatePostPreview';
import PopularPostsBar from './PopularPostsBar';
import TopCommunitiesBar from './TopCommunitiesBar';
import Button from './Button';
import PostsArea from './post/PostsArea';
import Agreements from './Agreements';
import { authorization } from '../firebase/firebase';
import { changeCurrentSubreddit } from '../store/currentSubredditSlice';

function HomePage() {
  const subredditsData = useSelector(selectSubreddits);
  const [chosenSubreddits, setChosenSubreddits] = useState([]);
  const dispatch = useDispatch();

  // update subreddits for posts area every time they change
  useEffect(() => {
    setChosenSubreddits(Object.values(subredditsData));
    dispatch(changeCurrentSubreddit(null));
  }, [subredditsData]);

  return (
    <>
      <div id="left-side">
        {authorization.isUserSignedIn() ? <CreatePostPreview /> : null}
        <PopularPostsBar />
        <PostsArea subreddits={chosenSubreddits} />
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
