import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { string, number, arrayOf, object } from 'prop-types';
import { database, authorization } from '../firebase/firebase';
import styled from 'styled-components';
import upIcon from '../assets/upvote_icon.svg';
import downIcon from '../assets/downvote_icon.svg';
import commentsIcon from '../assets/comments_icon.svg';
import shareIcon from '../assets/share_icon.svg';
import saveIcon from '../assets/save_icon.svg';
import hideIcon from '../assets/hide_icon.svg';
import IconLink from './IconLink';
import SubredditIcon from './SubredditIcon';
import formatUpVotes from '../utils/formatUpVotes';
import { selectUser } from '../store/userSlice';

const Post = styled.article`
  display: grid;
  gap: 10px;
  padding-right: 0px;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 20px 1fr 30px;
  grid-template-areas:
    "vote sub"
    "vote main"
    "vote comm";

  & > div {
    padding-right: 10px;
  }

  em {
    font-weight: bold;
    color: black;
  }

  div {
    display: flex;
  }
  &:hover {
    outline: 1px solid grey;
    cursor: pointer;
  }

  & > .vote-area-post {
    grid-area: vote;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    img {
      width: 20px;
    }
    p {
      font-weight: bold;
      color: ${(props) =>
        props.voteType === "upVote"
          ? "var(--up-vote-color)"
          : props.voteType === "downVote"
          ? "var(--reddit-blue-light)"
          : "black"};
    }
  }

  & > .top-area-post {
    grid-area: sub;
    gap: 3px;
    a:hover {
      text-decoration: underline;
    }
    a,
    p {
      font-size: 0.8rem;
      color: grey;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  & > .main-area-post {
    grid-area: main;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-right: 0px;
    & > *:not(img) {
      padding-right: 13px;
    }
    img {
      max-width: 100%;
    }
    p {
      font-size: 0.82rem;
      line-height: 1.5;
      white-space: pre-wrap;
      max-height: 250px;
      overflow: hidden;
      -webkit-mask-image: -webkit-gradient(
        linear,
        left 70%,
        left bottom,
        from(rgba(0, 0, 0, 1)),
        to(rgba(0, 0, 0, 0))
      );
    }
  }

  & > .bottom-area-post {
    grid-area: comm;
  }
`;

function PostPreview({
  subredditName,
  subredditIcon,
  postId,
  voteType,
  poster,
  title,
  text,
  upVotes,
  timePosted,
  comments,
  img,
}) {
  const [previousVote, setPreviousVote] = useState(voteType);
  const [votes, setVotes] = useState(upVotes);
  const user = useSelector(selectUser);
  // updates number of upvotes in post
  function updateVotes(e) {
    // Only allow vote if user is authorized
    if (authorization.getUser() !== null) {
      // if(authorization.user)
      // can be 'upVote' or 'downVote'
      const newVoteType = e.target.getAttribute('data');
      switch (true) {
        // previously clicked vote => new vote
        // upVote => upVote
        case newVoteType === 'upVote' && previousVote === 'upVote':
          setPreviousVote('');
          setVotes((prevVotes) => prevVotes - 1);
          database.updateVotes(user.username, subredditName, postId, -1, '');
          break;
        // none => upVote
        case newVoteType === 'upVote' && previousVote === '':
          setPreviousVote('upVote');
          setVotes((prevVotes) => prevVotes + 1);
          database.updateVotes(
            user.username,
            subredditName,
            postId,
            1,
            newVoteType
          );
          break;
        // downVote => downVote
        case newVoteType === "downVote" && previousVote === "downVote":
          setPreviousVote("");
          setVotes((prevVotes) => prevVotes + 1);
          database.updateVotes(user.username, subredditName, postId, 1, "");
          break;
        // none => downVote
        case newVoteType === "downVote" && previousVote === "":
          setPreviousVote("downVote");
          setVotes((prevVotes) => prevVotes - 1);
          database.updateVotes(
            user.username,
            subredditName,
            postId,
            -1,
            newVoteType
          );
          break;
        // downvote => upvote
        case newVoteType === "downVote" && previousVote === "upVote":
          setPreviousVote("downVote");
          setVotes((prevVotes) => prevVotes - 2);
          database.updateVotes(
            user.username,
            subredditName,
            postId,
            -2,
            newVoteType
          );
          break;
        // upvote => downvote
        case newVoteType === "upVote" && previousVote === "downVote":
          setPreviousVote("upVote");
          setVotes((prevVotes) => prevVotes + 2);
          database.updateVotes(
            user.username,
            subredditName,
            postId,
            2,
            newVoteType
          );
          break;
        default:
          break;
      }
    } else {
      openLogInModal();
    }
  }

  return (
    <Post className="main-child" voteType={previousVote}>
      <div className="vote-area-post">
        <IconLink fill="orange" onClick={updateVotes} data="upVote" colored={previousVote === 'upVote'}>
          <img src={upIcon} alt="" data="upVote"/>
        </IconLink>
        <p>{formatUpVotes(votes)}</p>
        <IconLink fill="blue" onClick={updateVotes} data="downVote" colored={previousVote === 'downVote'}>
          <img src={downIcon} alt="" data="downVote"/>
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
        {/* display image if any is provided */}
        {img !== '' ? <img src={img} alt="Content image" data-testid="image-content" /> : null}
        {/* display text if any is provided */}
        {text !== '' ? <p>{text}</p> : null}
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
  text: '',
  voteType: '',
  comments: [],
  img: '',
};

PostPreview.propTypes = {
  subredditName: string.isRequired,
  subredditIcon: string,
  postId: string.isRequired,
  poster: string.isRequired,
  title: string.isRequired,
  text: string,
  upVotes: number.isRequired,
  voteType: string,
  timePosted: string.isRequired,
  comments: arrayOf(object),
  img: string,
};

export default PostPreview;
