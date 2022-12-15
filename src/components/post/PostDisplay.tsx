import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import SubredditAbout from '../subreddit/SubredditAbout';
import Agreements from '../Agreements';
import Button from '../Button';
import Post from './Post';
import { changeCurrentSubreddit } from '../../store/currentSubredditSlice';

function PostDisplay() {
  const { name, postId } = useParams();
  const user = useSelector(selectUser);
  const [post, setPost] = useState(false);
  const [chosenSubreddit, setChosenSubreddit] = useState(false);
  const dispatch = useDispatch();


  function isPostUrlImage(url) {
    if (url !== undefined) {
      const extension = url.split('.').pop();
      const possibleImageExtensions = ['jpeg', 'jpg', 'png', 'gif'];
      return possibleImageExtensions.includes(extension);
    }
    return false;
  }

  function reloadPost() {
    setPost(false);
    database.getPost(name, postId)
      .then((data) => setPost(data));
  }

  // get post from database on mount
  useEffect(() => {
    database.getSubredditData(name)
      .then((data) => setChosenSubreddit(data));

    database.getPost(name, postId)
      .then((data) => setPost(data));
  }, []);

  useEffect(() => {
    if (chosenSubreddit !== false) {
      dispatch(changeCurrentSubreddit(chosenSubreddit.name));
    }
  }, [chosenSubreddit]);

  return (
    <>
      <div id="left-side">
        {post !== false ? (
          <Post
            postId={postId}
            subredditName={name}
            subredditIcon={chosenSubreddit.icon}
            poster={post.originalPoster}
            timePosted={post.timePosted}
            voteType={
              user.username !== undefined && user.votes[postId] !== undefined
                ? user.votes[postId]
                : ""
            }
            text={post.text}
            title={post.title}
            img={isPostUrlImage(post.url) ? post.url : post.imageUrl}
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
