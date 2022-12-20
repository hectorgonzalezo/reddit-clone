import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostsByUSer, getPostsInSubreddit } from '../../api/posts';
import defaultCommunityIcon from '../../defaultCommunityIcon';
import Post from './Post';
import reorderPosts from '../../utils/reorderPosts';
import { selectUser } from '../../store/userSlice';
import { selectSubreddits } from '../../store/subredditsSlice';

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
  const [posts, setPosts] = useState<IPost[]>([]);
  const user = useSelector(selectUser);
  const currentSubreddits = useSelector(selectSubreddits);
  const navigate = useNavigate();
  let rendered = false;
  const { userId } = useParams();

  async function getTop(
    subredditName: string,
    subredditIcon: string
  ): Promise<IPost[]> {
    const subredditId = currentSubreddits[subredditName]._id;
    const response = await getPostsInSubreddit(subredditId);
    // add subreddit name and icon to post
    const topPosts = response.posts.map((post) => ({
      ...post,
      subredditName,
      subredditIcon,
    }));
    return topPosts;
  }

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
    // if only displaying a particular user posts
    if (onlyUser) {
      setPosts([]);
      Object.values(subreddits).forEach((subreddit: ICommunity) => {
        getPostsByUSer(userId as string)
          .then((userPosts) => {
            // only get posts authored by user
            setPosts(reorderPosts(userPosts.posts, order));
          })
          .catch((error) => console.log(error));
      });
    } else if (Object.values(subreddits).length === 1 && !rendered) {
      // for subreddit display
      setPosts([]);
      Object.values(subreddits).forEach((subreddit) => {
        // If there's no icon, show the default one
        getTop(
          subreddit.name,
          subreddit.icon || defaultCommunityIcon
        ).then((subPosts) => {
        newPosts = newPosts.concat(subPosts);
        setPosts(reorderPosts(newPosts, order));
        }).catch((error) => console.log(error));
      });
      rendered = false;
    } else if (Object.values(subreddits).length > 1) {
      // for homepage without user
      setPosts([]);
      Object.values(subreddits).forEach((subreddit) => {
        // If there's no icon, show the default one
        getTop(subreddit.name, subreddit.icon || defaultCommunityIcon)
          .then((subPosts) => {
            newPosts = newPosts.concat(subPosts);
            setPosts(reorderPosts(newPosts, order));
          })
          .catch((error) => console.log(error));
      });
    }
  }, [subreddits, user]);

  return (
    <PostsDiv id="posts">
      {posts.map((post) => (
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
      )}
    </PostsDiv>
  );
}


export default PostsArea;
