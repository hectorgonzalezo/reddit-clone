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
import { changeCurrentSubreddit } from '../store/currentSubredditSlice';

function HomePage(): JSX.Element {
  const subredditsData: SubredditsObject = useSelector(selectSubreddits);
  const user = useSelector(selectUser);
  const [chosenSubreddits, setChosenSubreddits] = useState({});
  const [postsOrder, setPostsOrder] = useState<PostOrder>('hot');
  const dispatch = useDispatch();

  function changeOrder(newOrder: PostOrder): void{
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
        {user.communities !== undefined ? <CreatePostPreview /> : null}
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
