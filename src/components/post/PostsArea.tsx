import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import defaultCommunityIcon from '../../defaultCommunityIcon';
import { database } from '../../firebase/firebase';
import Post from './Post';
import reorderPosts from '../../utils/reorderPosts';
import { selectUser } from '../../store/userSlice';

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
  const navigate = useNavigate();
  let rendered = false;
  const UserDisplayName = useParams().name;

  async function getTop(
    subredditName: string,
    subredditIcon: string
  ): Promise<IPost[]> {
    let topPosts = await database.getTopPostsInSubreddit(subredditName);
    // add subreddit name and icon to post
    topPosts = topPosts.map((post) => ({
      ...post,
      subredditName,
      subredditIcon,
    }));
    return topPosts;
  }

  function isPostUrlImage(url: string): boolean {
    if (url !== undefined) {
      const extension = url.split(".").pop() as string;
      const possibleImageExtensions = ["jpeg", "jpg", "png", "gif"];
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
      let userPosts: IPost[] = [];
      Object.values(subreddits).forEach((subreddit) => {
        getTop(
          subreddit.name,
          subreddit.icon || defaultCommunityIcon
        ).then((allPosts) => {
          // only get posts authored by user
          const newAllPosts = allPosts.filter((post) => post.user === UserDisplayName);
          userPosts = userPosts.concat(newAllPosts);
          setPosts(reorderPosts(userPosts, order));
        }
        )
        .catch((error) => console.log(error));
      });
    } else if (Object.values(subreddits).length === 1 && !rendered) {
      // for subreddit display
      setPosts([]);
      Object.values(subreddits).forEach(async (subreddit) => {
        // If there's no icon, show the default one
        const subPosts = await getTop(
          subreddit.name,
          subreddit.icon || defaultCommunityIcon
        );
        newPosts = newPosts.concat(subPosts);
        setPosts(reorderPosts(newPosts, order));
      });
      rendered = false;
    } else if (Object.values(subreddits).length > 2) {
      // for homepage without user
      setPosts([]);
      Object.values(subreddits).forEach(async (subreddit) => {
        // If there's no icon, show the default one
        const subPosts = await getTop(
          subreddit.name,
          subreddit.icon || defaultCommunityIcon
        );
        newPosts = newPosts.concat(subPosts);
        setPosts(reorderPosts(newPosts, order));
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
            onClick={(e) => gotToPost(e, post.community.name, post._id)}
            key={`${post.title}-${post.community.name as string}-${
              post.createdAt
            }`}
            postId={post._id}
            subredditName={post.community.name}
            subredditIcon={post.community.icon}
            poster={post.user}
            timePosted={post.user}
            voteType={
              user.username !== undefined && user.votes[post._id] !== undefined
                ? user.votes[post._id]
                : ""
            }
            text={post.text}
            title={post.title}
            img={imageUrl}
            url={post._url}
            upVotes={post.upVotes}
            comments={post.comments}
          />
        );
      })}
    </PostsDiv>
  );
}


export default PostsArea;
