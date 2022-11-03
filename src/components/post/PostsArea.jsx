import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { arrayOf, objectOf, string, number, oneOfType } from 'prop-types';
import { database } from '../../firebase/firebase';
import Post from './Post';
import reorderPosts from '../../utils/reorderPosts';
import { selectUser } from '../../store/userSlice';

const defaultIconUrl = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=b65c667b-5299-404a-b8d9-5d94c580936d'

const PostsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

function PostsArea({ subreddits, order }) {
  const [posts, setPosts] = useState([]);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  let rendered = false;

  async function getTop(subredditName, subredditIcon) {
    if (posts.length === 0) {
      let topPosts = await database.getTopPostsInSubreddit(subredditName);
      // add subreddit name and icon to post
      topPosts = topPosts.map((post) => ({
        ...post,
        subredditName,
        subredditIcon,
      }));
      setPosts((prevPosts) => reorderPosts([...prevPosts, ...topPosts], order));
    }
  }

  function isPostUrlImage(url) {
    if (url !== undefined) {
      const extension = url.split('.').pop();
      const possibleImageExtensions = ['jpeg', 'jpg', 'png', 'gif'];
      return possibleImageExtensions.includes(extension);
    }
    return false;
  }

  // go to post when clicking on div
  function gotToPost(e, subredditName, postId) {
    e.stopPropagation();
    // Don't navigate to post if pressing on an external link
    if (e.target.tagName !== 'A' && e.target.tagName !== 'EM') {
      navigate(`/r/${subredditName}/${postId}`);
    }
    window.scrollTo(0, 0);
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

  // reorder posts when fetching new or changing the order
  useEffect(() => {
    setPosts(reorderPosts(posts, order));
  }, [order]);

  return (
    <PostsDiv id="posts">
      {posts.map((post) => {
        const imageUrl = isPostUrlImage(post.url) ? post.url : post.imageUrl;
        return (
          <Post
            preview
            onClick={(e) => gotToPost(e, post.subredditName, post.id)}
            key={`${post.title}-${post.subredditName}-${post.timePosted}`}
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
      })}
    </PostsDiv>
  );
}

PostsArea.defaultProps = {
  order: 'hot',
};

PostsArea.propTypes = {
  subreddits: arrayOf(objectOf(oneOfType([number, string]))).isRequired,
  order: string,
};

export default PostsArea;
