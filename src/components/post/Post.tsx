import React, { SyntheticEvent, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { vote } from '../../api/posts';
import styled from 'styled-components';
import upIcon from '../../assets/upvote_icon.svg';
import downIcon from '../../assets/downvote_icon.svg';
import commentsIcon from '../../assets/comments_icon.svg';
import defaultCommunityIcon from '../../defaultCommunityIcon';
import IconLink from '../IconLink';
import SubredditIcon from '../SubredditIcon';
import formatUpVotes from '../../utils/formatUpVotes';
import CommentsDisplay from './CommentsDisplay';
import CommentCreator from './CommentCreator';
import { selectUser } from '../../store/userSlice';
import { toggleLogInModal } from '../../store/loginModalSlice';
import countComments from '../../utils/countComents';
import '../../styles/postStyle.scss';
import { selectSubreddits } from '../../store/subredditsSlice';


interface PostProps {
  preview?: boolean;
  onClick?: (arg0: SyntheticEvent) => void;
  subredditName: string;
  subredditId: string;
  subredditIcon?: string;
  postId: string;
  voteType?: Vote;
  poster: string;
  title: string;
  text?: string;
  url?: string;
  upVotes: number;
  timePosted: string;
  comments?: IComment[];
  img?: string;
  reloadPost?: () => void;
};

interface PostContainerProps {
  voteType: Vote;
  preview: boolean;
}

const PostContainer = styled.article<PostContainerProps>`
  .vote-area-post {
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
}
  &:hover {
    ${(props) => props.preview
          ? `
    outline: 1px solid grey;
    cursor: pointer;
    `: ""
  }
  }

  .post-text {
      ${(props) => props.preview
          ? `
      white-space: pre-wrap;
      max-height: 200px;
      overflow: hidden;
      -webkit-mask-image: -webkit-gradient(
        linear,
        left 70%,
        left bottom,
        from(rgba(0, 0, 0, 1)),
        to(rgba(0, 0, 0, 0))
      );`
          : ""
      };
  }
}
`;

function Post({
  preview = false,
  onClick = (e: SyntheticEvent) => {},
  subredditName,
  subredditId,
  subredditIcon = defaultCommunityIcon,
  postId,
  voteType = '',
  poster,
  title,
  text = '',
  url = '',
  upVotes,
  timePosted,
  comments = [],
  img = '',
  reloadPost = () => {},
}: PostProps): JSX.Element {
  const [previousVote, setPreviousVote] = useState(voteType);
  const [votes, setVotes] = useState(upVotes);
  const user = useSelector(selectUser);
  const subreddits = useSelector(selectSubreddits);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // updates number of upvotes in post
  function updateVotes(e: SyntheticEvent): void {
    const target = e.target as HTMLAnchorElement;
    const newVoteType = target.getAttribute('data') as Vote;
    e.stopPropagation();
    // Only allow vote if user is authorized
    if (user.username !== undefined && newVoteType !== null) {
      // can be 'upVote' or 'downVote'
      switch (true) {
        // previously clicked vote => new vote
        // upVote => upVote
        case newVoteType === 'upVote' && previousVote === 'upVote':
          setPreviousVote('');
          setVotes((prevVotes) => prevVotes - 1);
          vote(user._id, subredditId, '', user.token)
            .then((result) => {})
            .catch((error) => console.log(error));
          break;
        // none => upVote
        case newVoteType === 'upVote' && previousVote === '':
          setPreviousVote('upVote');
          setVotes((prevVotes) => prevVotes + 1);
          vote(user._id, subredditId, newVoteType, user.token)
            .then((result) => {})
            .catch((error) => console.log(error));
          break;
        // downVote => downVote
        case newVoteType === 'downVote' && previousVote === 'downVote':
          setPreviousVote('');
          setVotes((prevVotes) => prevVotes + 1);
          vote(user._id, subredditId, '', user.token)
          .then((result) => {})
          .catch((error) => console.log(error));
          break;
        // none => downVote
        case newVoteType === 'downVote' && previousVote === '':
          setPreviousVote('downVote');
          setVotes((prevVotes) => prevVotes - 1);
          vote(user._id, subredditId, newVoteType, user.token)
            .then((result) => {})
            .catch((error) => console.log(error));
          break;
        // downvote => upvote
        case newVoteType === 'downVote' && previousVote === 'upVote':
          setPreviousVote('downVote');
          setVotes((prevVotes) => prevVotes - 2);
          vote(user._id, subredditId, newVoteType, user.token)
            .then((result) => {})
            .catch((error) => console.log(error));
          break;
        // upvote => downvote
        case newVoteType === 'upVote' && previousVote === 'downVote':
          setPreviousVote('upVote');
          setVotes((prevVotes) => prevVotes + 2);
          vote(user._id, subredditId, newVoteType, user.token)
            .then((result) => {})
            .catch((error) => console.log(error));
          break;
        default:
          break;
      }
    } else {
      // if theres no user signed in, show log in pop up
      dispatch(toggleLogInModal());
    }
  }

  function goToPostComment(e: SyntheticEvent): void {
    e.stopPropagation();
    navigate(`/r/${subredditName}/${postId}#create-post-area`);
  }

  return (
    <PostContainer
      className="main-child post"
      onClick={onClick}
      voteType={previousVote}
      preview={preview}
      data-testid="post-container"
      aria-label={`post ${title}`}
    >
      <div className="vote-area-post">
        <IconLink
          fill="orange"
          onClick={updateVotes}
          data="upVote"
          colored={previousVote === "upVote"}
          ariaLabel="up vote"
        >
          <img src={upIcon} alt="" data-vote="upVote" data-testid="up-vote-img" />
        </IconLink>
        <p data-testid="votes-display">{formatUpVotes(votes)}</p>
        <IconLink
          fill="blue"
          onClick={updateVotes}
          data="downVote"
          colored={previousVote === "downVote"}
          ariaLabel="down vote"
        >
          <img
            src={downIcon}
            alt=""
            data-vote="downVote"
            data-testid="down-vote-img"
          />
        </IconLink>
      </div>

      <div className="top-area-post">
        <Link to={`/r/${subredditName}`}>
          <SubredditIcon icon={subredditIcon} small subredditName={subredditName}/>
          <em>r/{subredditName}</em>
        </Link>
        <p>&nbsp;•&nbsp;</p>
        <p>
          {" "}
          Posted by <Link to={`/u/${poster}`}>u/{poster}</Link>{" "}
          {formatDistanceToNow(new Date(timePosted))}
          &nbsp;ago
        </p>
      </div>

      <div className="main-area-post">
        <h1>{title}</h1>
        {url !== "" ? <a href={url}>{url}</a> : null}
        {/* display image if any is provided */}
        {img !== "" ? (
          <img src={img} alt="Content" data-testid="image-content" />
        ) : null}
        {/* display text if any is provided */}
        {text !== "" ? <p className="post-text">{text}</p> : null}
      </div>

      <div className="bottom-area-post">
        <IconLink onClick={goToPostComment}>
          <img src={commentsIcon} alt="" className="icon" />
          <p>{formatUpVotes(countComments(comments))} Comments</p>
        </IconLink>
      </div>
      {!preview ? (
        <>
          {user.username !== undefined ?
          <CommentCreator
            subreddit={subredditName}
            postId={postId}
            commentsList={comments}
            reloadPost={reloadPost}
          />
          : null}
          <CommentsDisplay
            comments={comments}
            subreddit={subredditName}
            postId={postId}
            reloadPost={reloadPost}
          />
        </>
      ) : null}
    </PostContainer>
  );
}


export default Post;
