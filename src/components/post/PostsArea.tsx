import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllPosts, getPostsByUSer, getPostsInSubreddit } from '../../api/posts';
import Post from './Post';
import reorderPosts from '../../utils/reorderPosts';
import { selectUser } from '../../store/userSlice';
import { selectPosts, addPosts } from '../../store/postsSlice';
import { selectSubreddits } from '../../store/subredditsSlice';
import { useDispatch } from 'react-redux';
import loadingPacman from '../../assets/loading_pacman.gif';

interface PostsAreaProps {
  subreddits: SubredditsObject;
  order?: PostOrder;
  onlyUser?: boolean;
};

const PostsDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

function PostsArea({
  subreddits,
  order = "hot",
  onlyUser = false,
}: PostsAreaProps): JSX.Element {
  const user = useSelector(selectUser);
  const [previousUser, setPreviousUser] = useState(user);
  const currentPosts = useSelector(selectPosts);
  const [posts, setPosts] = useState<IPost[]>(Object.values(currentPosts));
  const currentSubreddits = useSelector(selectSubreddits);
  const [rendered, setRendered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();


  function isPostUrlImage(url: string | undefined): boolean {
    if (url !== undefined) {
      const urlObj = new URL(url);
      
      const extension = urlObj.pathname.split('.').pop() as string;
      // remove queries
      const possibleImageExtensions = ['jpeg', 'jpg', 'png', 'gif'];
      return possibleImageExtensions.includes(extension);
    }
    return false;
  }

  // go to post when clicking on div
  function gotToPost(e: SyntheticEvent, subredditName: string, postId: string): void {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    // Don't navigate to post if pressing on an external link
    if (target.tagName !== "A" && target.tagName !== "EM") {
      navigate(`/r/${subredditName}/${postId}`);
    }
    window.scrollTo(0, 0);
  }

  // reorder posts when fetching new or changing the order
  useEffect(() => {
    setPosts(reorderPosts(posts, order));
  }, [order]);


  useEffect(() => {
    let newPosts: IPost[] = [];
    // fetch posts from database
    // only fetch posts after getting all subreddits from store and if posts are empty
    if (
      posts.length === 0 &&
      Object.values(subreddits).length > 0 &&
      !rendered
    ) {
      // if only displaying a particular user posts
      if (onlyUser) {
        getPostsByUSer(userId as string)
          .then((userPosts) => {
            // only get posts authored by user
            setPosts(reorderPosts(userPosts.posts, order));
          })
          .catch((error) => console.log(error));
      } else if (Object.values(subreddits).length === 1) {
        // for subreddit display
        const subredditId = currentSubreddits[Object.keys(subreddits)[0]]._id;
        // get posts only in particular subreddit
        getPostsInSubreddit(subredditId)
          .then((subPosts) => {
            newPosts = newPosts.concat(subPosts.posts);
            setPosts(reorderPosts(newPosts, order));
          })
          .catch((error) => console.log(error));
      } else if (Object.values(subreddits).length > 1) {
        // for homepage without user
        Object.values(subreddits).forEach((subreddit) => {
          // get all posts in every subreddit
          getAllPosts()
            .then((fetchedPosts) => {
              setPosts(reorderPosts(fetchedPosts.posts, order));
              dispatch(addPosts(fetchedPosts.posts));
            })
            .catch((error) => console.log(error));
        });
      }
      setRendered(true);
      // if posts are already in store, select only the ones from the user or subreddit
    } else if (onlyUser && !rendered) {
      // filter by posts authored by user
      const onlyUserPosts = posts.filter((post) => post.user._id === userId);
      setPosts(reorderPosts(onlyUserPosts, order));
      setRendered(true);
    } else if (Object.values(subreddits).length === 1 && !rendered) {
      const subredditId = currentSubreddits[Object.keys(subreddits)[0]]._id;
      // filter by posts in community
      const onlySubredditPosts = posts.filter(
        (post) => post.community._id === subredditId
      );
      setPosts(reorderPosts(onlySubredditPosts, order));
      setRendered(true);
    }
  }, [subreddits]);

  // when logging in or out, update posts
  // this prevents the user from voting twice
  useEffect(() => {
    // if user just logged in or out
    if (previousUser.username !== user.username) {
      setPosts([]);
      setTimeout(() => {
        setPosts(Object.values(currentPosts));
      }, 0);
      setPreviousUser(user);
    }
  }, [user]);

  return (
    <PostsDiv id="posts">
      {posts.length === 0?
      <div className='loading-container'>
        <h1 className='loading-title'>Loading server - this might take a while</h1>
        <img src={loadingPacman} className='loading-image' alt="" />
      </div>
      :
      posts.map((post) => (
          <Post
            preview
            onClick={(e) => gotToPost(e, post.community.name, post._id)}
            key={`${post.title}-${post.community.name as string}-${
              post.createdAt
            }`}
            postId={post._id}
            subredditName={post.community.name}
            subredditId={post.community._id}
            subredditIcon={post.community.icon}
            poster={post.user}
            timePosted={post.createdAt}
            voteType={
              user.username !== undefined && user.votes[post._id] !== undefined
                ? user.votes[post._id]
                : ""
            }
            text={post.text}
            title={post.title}
            img={isPostUrlImage(post.url) ? post.url : ""}
            url={isPostUrlImage(post.url) ? "" : post.url}
            upVotes={post.upVotes}
            comments={post.comments}
          />
        )
      )
    }
    </PostsDiv>
  );
}


export default PostsArea;
