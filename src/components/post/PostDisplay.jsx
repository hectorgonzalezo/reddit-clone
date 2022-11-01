import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import Post from './Post';

function PostDisplay() {
  const { name, postId } = useParams();
  const user = useSelector(selectUser);
  const [post, setPost] = useState(false);
  
  function isPostUrlImage(url) {
    if (url !== undefined) {
      const extension = url.split('.').pop();
      const possibleImageExtensions = ['jpeg', 'jpg', 'png', 'gif'];
      return possibleImageExtensions.includes(extension);
    }
    return false;
  }

  // get post from database on mount
  useEffect(() => {
    database.getPost(name, postId)
      .then((data) => setPost(data));
  }, [])

  if (post !== false) {
    const imageUrl = isPostUrlImage(post.url) ? post.url : post.imageUrl;
    return (
      <Post
        postId={post.id}
        subredditName={post.subredditName}
        subredditIcon={post.subredditIcon}
        poster={post.originalPoster}
        timePosted={post.timePosted}
        voteType={
          user.username !== undefined && user.votes[post.id] !== undefined
            ? user.votes[post.id]
            : ""
        }
        text={post.text}
        title={post.title}
        img={imageUrl}
        url={post.url}
        upVotes={post.upVotes}
        comments={post.comments}
      />
    );
  }
  return <h1>postId</h1>
}

export default PostDisplay;
