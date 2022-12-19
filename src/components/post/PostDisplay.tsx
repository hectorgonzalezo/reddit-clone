import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { getPost } from '../../api/posts';
import { getSubreddit } from '../../api/communities';
import SubredditAbout from '../subreddit/SubredditAbout';
import Agreements from '../Agreements';
import Button from '../Button';
import Post from './Post';
import { changeCurrentSubreddit } from '../../store/currentSubredditSlice';
import { selectSubreddits } from '../../store/subredditsSlice';


function PostDisplay(): JSX.Element {
  const params = useParams();
  const name= params.name as string;
  const postId = params.postId as string;

  const user = useSelector(selectUser);
  const subreddits = useSelector(selectSubreddits);
  const [post, setPost] = useState<IPost | false>(false);
  const [chosenSubreddit, setChosenSubreddit] = useState<ICommunity | false>(false);
  const dispatch = useDispatch();


  function isPostUrlImage(url: string | undefined): boolean {
    if (url !== undefined) {
      const extension = url.split('.').pop() as string;
      const possibleImageExtensions = ['jpeg', 'jpg', 'png', 'gif'];
      return possibleImageExtensions.includes(extension);
    }
    return false;
  }

  function reloadPost(): void {
    setPost(false);
    getPost(postId)
      .then((data) => setPost(data))
      .catch((error) => console.log(error));
  }

  // get post from database on mount
  useEffect(() => {
    const subredditId = subreddits[name]._id;
    getSubreddit(subredditId)
      .then((data) => setChosenSubreddit(data.community))
      .catch((error) => console.log(error));

    getPost(postId)
      .then((data) => setPost(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (chosenSubreddit !== false) {
      dispatch(changeCurrentSubreddit(chosenSubreddit.name));
    }
  }, [chosenSubreddit]);

  return (
    <>
      <div id="left-side">
        {post !== false && chosenSubreddit !== false? (
          <Post
            postId={postId}
            subredditName={name}
            subredditIcon={chosenSubreddit.icon}
            poster={post.user}
            timePosted={post.createdAt}
            voteType={
              user.username !== undefined && user.votes[postId] !== undefined
                ? user.votes[postId]
                : ""
            }
            text={post.text}
            title={post.title}
            img={isPostUrlImage(post.url) ? post.url : ""}
            url={post.url}
            upVotes={post.upVotes}
            comments={post.comments}
            reloadPost={reloadPost}
          />
        ) : null}
      </div>
      <div id="right-side">
        {chosenSubreddit !== false ? (
          <SubredditAbout subreddit={chosenSubreddit} post />
        ) : null}
        <Agreements />
        <Button text="Back to Top" onClick={() => window.scrollTo({ top: 0 })}/>
      </div>
    </>
  );
}

export default PostDisplay;
