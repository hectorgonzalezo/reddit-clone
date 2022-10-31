import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { string, number, arrayOf, object, bool } from 'prop-types';
import styled from 'styled-components';
import { database } from '../firebase/firebase';
import upIcon from '../assets/upvote_icon.svg';
import downIcon from '../assets/downvote_icon.svg';
import commentsIcon from '../assets/comments_icon.svg';
import shareIcon from '../assets/share_icon.svg';
import saveIcon from '../assets/save_icon.svg';
import hideIcon from '../assets/hide_icon.svg';
import IconLink from './IconLink';
import SubredditIcon from './SubredditIcon';
import formatUpVotes from '../utils/formatUpVotes';
import CommentsDisplay from './CommentsDisplay';
import { selectUser } from '../store/userSlice';
import { toggleLogInModal } from '../store/loginModalSlice';
import '../styles/postStyle.scss';

const PostContainer = styled.article`
  & > .vote-area-post {
    p {
      color: ${(props) => {
    if (props.voteType === 'upVote') {
      return 'var(--up-vote-color)';
    } else if (props.voteType === "downVote") {
      return 'var(--reddit-blue-light)';
    } 
      return 'black';
    }}
  }


  & > .main-area-post {
    p {
      ${(props) =>
        props.preview
          ? `
      white-space: pre-wrap;
      max-height: 250px;
      overflow: hidden;
      -webkit-mask-image: -webkit-gradient(
        linear,
        left 70%,
        left bottom,
        from(rgba(0, 0, 0, 1)),
        to(rgba(0, 0, 0, 0))
      );`
          : ""};
    }
  }
}
`;

function Post({
  preview,
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
  const dispatch = useDispatch();

  // updates number of upvotes in post
  function updateVotes(e) {
    // Only allow vote if user is authorized
    if (user.username !== undefined) {
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
        case newVoteType === 'downVote' && previousVote === 'downVote':
          setPreviousVote('');
          setVotes((prevVotes) => prevVotes + 1);
          database.updateVotes(user.username, subredditName, postId, 1, '');
          break;
        // none => downVote
        case newVoteType === 'downVote' && previousVote === '':
          setPreviousVote('downVote');
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
        case newVoteType === 'downVote' && previousVote === 'upVote':
          setPreviousVote('downVote');
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
        case newVoteType === 'upVote' && previousVote === 'downVote':
          setPreviousVote('upVote');
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
      // if theres no user signed in, show log in pop up
      dispatch(toggleLogInModal());
    }
  }

  return (
    <PostContainer className="main-child post" voteType={previousVote} preview={preview} data-testid="post-container">
      <div className="vote-area-post">
        <IconLink fill="orange" onClick={updateVotes} data="upVote" colored={previousVote === 'upVote'}>
          <img src={upIcon} alt="" data="upVote" data-testid="up-vote-img" />
        </IconLink>
        <p data-testid="votes-display">{formatUpVotes(votes)}</p>
        <IconLink fill="blue" onClick={updateVotes} data="downVote" colored={previousVote === 'downVote'}>
          <img src={downIcon} alt="" data="downVote" data-testid="down-vote-img" />
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
      {!preview ? <CommentsDisplay /> : null}
    </PostContainer>
  );
}

Post.defaultProps = {
  preview: false,
  subredditIcon: 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=4b92a9a0-3b37-4058-bdca-627d706dd7d6',
  text: '',
  voteType: '',
  comments: [],
  img: '',
};

Post.propTypes = {
  preview: bool,
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

export default Post;
