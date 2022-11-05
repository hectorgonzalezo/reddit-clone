import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { arrayOf, objectOf, string, number, oneOfType, array, bool } from 'prop-types';
import { authorization, database } from '../../firebase/firebase';
import Post from './Post';
import reorderPosts from '../../utils/reorderPosts';
import { selectUser } from '../../store/userSlice';

const defaultIconUrl = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=b65c667b-5299-404a-b8d9-5d94c580936d'

const PostsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

function PostsArea({ subreddits, order, onlyUser }) {
  const [posts, setPosts] = useState([]);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [rendered, setRendered] = useState(false);
  const UserDisplayName = useParams().name;

  async function getTop(subredditName, subredditIcon) {
    let topPosts = await database.getTopPostsInSubreddit(subredditName);
    // add subreddit name and icon to post
    topPosts = topPosts.map((post) => ({
      ...post,
      subredditName,
      subredditIcon,
    }));
    return topPosts;
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


  // reorder posts when fetching new or changing the order
  useEffect(() => {
    setPosts(reorderPosts(posts, order));
  }, [order]);

  useEffect(() => {
    let newPosts = [];
    // if oonly displaying a particular user posts
    if (onlyUser) {
      setPosts([]);
      let userPosts = []
      Object.values(subreddits).forEach(async (subreddit) => {
        let allPosts = await getTop(
          subreddit.name,
          subreddit.icon || defaultIconUrl
        );
        // only get posts authored by user
        allPosts = allPosts.filter(
          (post) => post.originalPoster === UserDisplayName
        );
        userPosts = userPosts.concat(allPosts)
        setPosts(userPosts);
      });
      setRendered(true);
    } else if (Object.values(subreddits).length === 1 && !rendered) {
      // for subreddit display
      setPosts([]);
      Object.values(subreddits).forEach(async (subreddit) => {
        // If there's no icon, show the default one
        const subPosts = await getTop(
          subreddit.name,
          subreddit.icon || defaultIconUrl
        );
        newPosts = newPosts.concat(subPosts);
        setPosts(newPosts);
      });
      setRendered(true);
    } else if (user.subreddits !== undefined && authorization.isUserSignedIn()) {
      setPosts([]);
      // for homepage with user
      user.subreddits.forEach(async (subreddit) => {
        if (subreddits[subreddit] !== undefined) {
          // If there's no icon, show the default one
          const subPosts = await getTop(
            subreddits[subreddit].name,
            subreddits[subreddit].icon || defaultIconUrl
          );
          newPosts = newPosts.concat(subPosts);
          setPosts(newPosts);
        }
      });
    } else if (Object.values(subreddits).length > 2) {
      // for homepage without user
      setPosts([]);
      Object.values(subreddits).forEach(async (subreddit) => {
        // If there's no icon, show the default one
        const subPosts = await getTop(
          subreddit.name,
          subreddit.icon || defaultIconUrl
        );
        newPosts = newPosts.concat(subPosts);
        setPosts(newPosts);
      });
    }
  }, [subreddits, user]);

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
  onlyUser: false,
};

PostsArea.propTypes = {
  subreddits: objectOf(
    oneOfType([
      number,
      string,
      array,
      objectOf(oneOfType([number, string, array])),
    ])
  ).isRequired,
  order: string,
  onlyUser: bool,
};

export default PostsArea;
