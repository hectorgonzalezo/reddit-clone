import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { selectSubreddits } from '../../store/subredditsSlice';
import SubredditBanner from './SubredditBanner';
import PopularPostsBar from '../PopularPostsBar';
import PostsArea from '../post/PostsArea';
import Button from '../Button';
import SubredditAbout from './SubredditAbout';
import Agreements from '../Agreements';
import CreatePostPreview from '../CreatePostPreview';
import { changeCurrentSubreddit } from '../../store/currentSubredditSlice';
import '../../styles/subredditStyle.scss';

function SubredditDisplay(): JSX.Element {
  const subredditsData = useSelector(selectSubreddits);
  const user = useSelector(selectUser);
  const userCommunities = user.communities as string[];
  const params = useParams();
  const name = params.name as string;
  
  const [chosenSubreddit, setChosenSubreddit] = useState<ICommunity>();
  const [postsOrder, setPostsOrder] = useState<PostOrder>('hot');
  const dispatch = useDispatch();

  function changeOrder(newOrder: PostOrder): void {
    setPostsOrder(newOrder);
  }

  useEffect(() => {
    setChosenSubreddit(subredditsData[name]);
    dispatch(changeCurrentSubreddit(name));
    setPostsOrder(postsOrder);
  }, [subredditsData, name]);

  return (
    <>
      {chosenSubreddit !== undefined ? (
        <SubredditBanner subreddit={chosenSubreddit} />
      ) : null}
      <div id="left-side">
        {
        chosenSubreddit !== undefined && userCommunities.includes(chosenSubreddit._id) ?
          <CreatePostPreview />
        : null}
        <PopularPostsBar changeOrder={changeOrder} />
        {chosenSubreddit !== undefined ? (
          <PostsArea
            subreddits={{ [chosenSubreddit.name]: chosenSubreddit }}
            order={postsOrder}
          />
        ) : null}
      </div>
      <div id="right-side">
        {chosenSubreddit !== undefined ? (
          <SubredditAbout subreddit={chosenSubreddit} />
        ) : null}
        <Agreements />
        <Button
          text="Back to Top"
          onClick={() => window.scrollTo({ top: 0 })}
        />
      </div>
    </>
  );
}

export default SubredditDisplay;
