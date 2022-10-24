import React from 'react';
import upIcon from '../assets/upvote_icon.svg';
import downIcon from '../assets/downvote_icon.svg';
import commentsIcon from '../assets/comments_icon.svg';
import shareIcon from '../assets/share_icon.svg';
import saveIcon from '../assets/save_icon.svg';
import hideIcon from '../assets/hide_icon.svg';
import IconLink from './IconLink';
import SubredditIcon from './SubredditIcon';
import formatUpVotes from '../utils/formatUpVotes';
import { formatDistanceToNow } from 'date-fns';
import { string, number, arrayOf, object } from 'prop-types';
import styled from 'styled-components';

const Post = styled.article`
  display: grid;
  gap: 10px;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 20px 1fr 30px;
  grid-template-areas: 
                       "vote sub"
                       "vote main"
                       "vote comm";

  em {
    font-weight: bold;
    color: black;
  }

  div {
    display: flex;
  }
  &:hover{
    outline: 1px solid grey;
    cursor: pointer;
  }

  & > .vote-area-post{
    grid-area: vote;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    img{
      width: 20px;
    }
  }

  & > .top-area-post{
    grid-area: sub;
    gap: 3px;
    a:hover{
      text-decoration: underline;
    }
    a,p{
      font-size: 0.8rem;
      color: grey;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  & > .main-area-post{
    grid-area: main;
  }

  & > .bottom-area-post{
    grid-area: comm;
  }
`;

function PostPreview({
  subredditName,
  subredditIcon,
  poster,
  title,
  upVotes,
  timePosted,
  comments,
}) {
  return (
    <Post className="main-child">
      <div className="vote-area-post">
        <IconLink fill="orange">
          <img src={upIcon} alt="" />
        </IconLink>
        <p>{formatUpVotes(upVotes)}</p>
        <IconLink fill="blue">
          <img src={downIcon} alt="" />
        </IconLink>
      </div>

      <div className="top-area-post">
        <a>
          <SubredditIcon icon={subredditIcon} small />
          <em>r/{subredditName}</em>
        </a>
        <p>&nbsp;•&nbsp;</p>
        <p>
          {" "}
          Posted by <a href="">u/{poster}</a>{" "}
          {formatDistanceToNow(new Date(timePosted))} ago
        </p>
      </div>

      <div className="main-area-post">
        <h1>{title}</h1>
      </div>

      <div className="bottom-area-post">
        <IconLink>
          <img src={commentsIcon} alt="" className="icon" />
          <p>{formatUpVotes(comments.length)} Comments</p>
        </IconLink>
        <IconLink>
          <img src={shareIcon} alt="" className="icon" />
          <p>Share</p>
        </IconLink>
        <IconLink>
          <img src={saveIcon} alt="" className="icon" />
          <p>Save</p>
        </IconLink>
        <IconLink>
          <img src={hideIcon} alt="" className="icon" />
          <p>Hide</p>
        </IconLink>
      </div>
    </Post>
  );
}

PostPreview.defaultProps = {
  subredditIcon: 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=4b92a9a0-3b37-4058-bdca-627d706dd7d6',
  comments: [],
};

PostPreview.propTypes = {
  subredditName: string.isRequired,
  subredditIcon: string,
  poster: string.isRequired,
  title: string.isRequired,
  upVotes: number.isRequired,
  timePosted: string.isRequired,
  comments: arrayOf(object),
};

export default PostPreview;
