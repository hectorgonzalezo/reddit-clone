import React, { useState, useEffect } from 'react';
import { arrayOf, string } from 'prop-types';
import database from '../firebase/firebase';
import PostPreview from './PostPreview';

function PostsArea({ subreddits }) {
  const [posts, setPosts] = useState([]);
  let rendered = false;

  // gets top posts of every subreddit
  useEffect(() => {
    async function getTop(subredditName, subredditIcon) {
      let topPosts = await database.getTopPostsInSubreddit(subredditName);
      // add subreddit name and icon to post
      topPosts = topPosts.map((post) => ({ ...post, subredditName, subredditIcon }));
      setPosts((prevPosts) => [...prevPosts, ...topPosts]);
    }
    // prevent double render
    if (!rendered) {
      getTop('aww', 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/aww_icon.jpeg?alt=media&token=b6bc425f-f335-4b73-8c36-df3df45bacd6');
    }
    rendered = true;
  }, []);


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
  subreddits: arrayOf(string).isRequired,
};

export default PostsArea;
