import React, { useState, useEffect } from 'react';
import { arrayOf, objectOf, string } from 'prop-types';
import database from '../firebase/firebase';
import PostPreview from './PostPreview';

const defaultIconUrl = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=4b92a9a0-3b37-4058-bdca-627d706dd7d6';


function PostsArea({ subreddits }) {
  const [posts, setPosts] = useState([]);
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
    <div id="posts">
      {posts.map((post) => (
        <PostPreview
          key={post.title}
          subredditName={post.subredditName}
          subredditIcon={post.subredditIcon}
          poster={post.originalPoster}
          timePosted={post.timePosted}
          title={post.title}
          upVotes={post.upVotes}
          comments={post.comments}
        />
      ))}
    </div>
  );
}

PostsArea.propTypes = {
  subreddits: arrayOf(objectOf(string)).isRequired,
};

export default PostsArea;
