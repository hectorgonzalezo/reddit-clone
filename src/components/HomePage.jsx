import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import CreatePostPreview from './CreatePostPreview';
import PopularPostsBar from './PopularPostsBar';
import TopCommunitiesBar from './TopCommunitiesBar';
import Button from './Button';
import PostsArea from './post/PostsArea';
import Agreements from './Agreements';
import { selectUser } from '../store/userSlice';

function HomePage() {
  const user = useSelector(selectUser);
  const subredditsData = useSelector(selectSubreddits);
  const [chosenSubreddits, setChosenSubreddits] = useState([]);

  // update subreddits for posts area every time they change
  useEffect(() => {
    setChosenSubreddits(Object.values(subredditsData));
  }, [subredditsData]);

  return (
    <>
      <div id="left-side">
        {user.username !== undefined ? <CreatePostPreview /> : null}
        <PopularPostsBar />
        <PostsArea subreddits={chosenSubreddits} />
      </div>
      <div id="right-side">
        <TopCommunitiesBar />
        <Agreements />
        <Button text="Back to Top" />
      </div>
    </>
  );
}

export default HomePage;
