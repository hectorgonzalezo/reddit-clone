import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { arrayOf, objectOf, string } from 'prop-types';
import uniqid from 'uniqid';
import { database } from '../firebase/firebase';
import PostPreview from './PostPreview';
import { selectUser } from '../store/userSlice';

const defaultIconUrl = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=4b92a9a0-3b37-4058-bdca-627d706dd7d6';

const PostsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

function PostsArea({ subreddits }) {
  const [posts, setPosts] = useState([]);
  const user = useSelector(selectUser);
  let rendered = false;
  async function getTop(subredditName, subredditIcon) {
    let topPosts = await database.getTopPostsInSubreddit(subredditName);
    // add subreddit name and icon to post
    topPosts = topPosts.map((post) => ({
      ...post,
      subredditName,
      subredditIcon,
    }));
    setPosts((prevPosts) => [...prevPosts, ...topPosts]);
  }

  function isPostUrlImage(url) {
    if (url !== undefined) {
      const extension = url.split('.').pop();
      const possibleImageExtensions = ['jpeg', 'jpg', 'png', 'gif'];
      return possibleImageExtensions.includes(extension);
    }
    return false;
  }

  // gets top posts of every subreddit
  useEffect(() => {
    // prevent double render
    if (!rendered) {
      subreddits.forEach((subreddit) => {
        // If there's no icon, show the default one
        getTop(subreddit.name, subreddit.icon || defaultIconUrl);
      });
    }
    rendered = true;
  }, [subreddits]);


  return (
    <PostsDiv id="posts">
      {posts.map((post) => {
        const imageUrl = isPostUrlImage(post.url) ? post.url : post.imageUrl;
        return (
          <PostPreview
            key={post.title + uniqid()}
            postId={post.id}
            subredditName={post.subredditName}
            subredditIcon={post.subredditIcon}
            poster={post.originalPoster}
            timePosted={post.timePosted}
            voteType={user.username !== undefined && user.votes[post.id] !== undefined ? user.votes[post.id] : ''}
            text={post.text}
            title={post.title}
            img={imageUrl}
            upVotes={post.upVotes}
            comments={post.comments}
          />
        );
      })}
    </PostsDiv>
  );
}

PostsArea.propTypes = {
  subreddits: arrayOf(objectOf(string)).isRequired,
};

export default PostsArea;
