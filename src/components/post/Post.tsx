import React, { SyntheticEvent, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { vote } from '../../api/posts';
import upIcon from '../../assets/upvote_icon.svg';
import downIcon from '../../assets/downvote_icon.svg';
import commentsIcon from '../../assets/comments_icon.svg';
import defaultCommunityIcon from '../../defaultCommunityIcon';
import IconLink from '../IconLink';
import SubredditIcon from '../SubredditIcon';
import formatUpVotes from '../../utils/formatUpVotes';
import CommentsDisplay from './CommentsDisplay';
import CommentCreator from './CommentCreator';
import { selectUser, addUser } from '../../store/userSlice';
import { toggleLogInModal } from '../../store/loginModalSlice';
import countComments from '../../utils/countComents';
import '../../styles/postStyle.scss';
import { addPost } from '../../store/postsSlice';


interface PostProps {
  preview?: boolean;
  onClick?: (arg0: SyntheticEvent) => void;
  subredditName: string;
  subredditId: string;
  subredditIcon?: string;
  postId: string;
  voteType?: Vote;
  poster: IUser;
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function sendVote(
    newVoteType: Vote,
    increase: number,
  ): void {
      const newVoteNumber = votes + increase;
      setVotes(newVoteNumber);
    // send request to update user and post
    vote(user._id, postId, newVoteType, increase, user.token)
      .then((data) => {
        // add user to store
        dispatch(addUser({ user: data.user, token: user.token }));
        // dispatch posts
        dispatch(addPost(data.post));
      })
      .catch((error) => console.log(error));
  }

  // updates number of upvotes in post
  function updateVotes(e: SyntheticEvent): void {
    const target = e.target as HTMLAnchorElement;
    const newVoteType = target.getAttribute('data') as Vote;
    e.stopPropagation();
    // Only allow vote if user is authorized
    if (user._id !== undefined && newVoteType !== null) {
      // can be 'upVote' or 'downVote'
      switch (true) {
        // previously clicked vote => new vote
        // upVote => upVote
        case newVoteType === 'upVote' && previousVote === 'upVote':
          setPreviousVote('');
          sendVote('', -1);
          break;
        // none => upVote
        case newVoteType === 'upVote' && previousVote === '':
          setPreviousVote('upVote');
          sendVote(newVoteType, 1);
          break;
        // downVote => downVote
        case newVoteType === 'downVote' && previousVote === 'downVote':
          setPreviousVote('');
          sendVote('', 1);
          break;
        // none => downVote
        case newVoteType === 'downVote' && previousVote === '':
          setPreviousVote('downVote');
          sendVote(newVoteType, -1);
          break;
        // downvote => upvote
        case newVoteType === 'downVote' && previousVote === 'upVote':
          setPreviousVote('downVote');
          sendVote(newVoteType, -2);
          break;
        // upvote => downvote
        case newVoteType === 'upVote' && previousVote === 'downVote':
          setPreviousVote('upVote');
          sendVote(newVoteType, 2);
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
          Posted by <Link to={`/u/${poster._id}`}>u/{poster.username}</Link>{" "}
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
            parentId={undefined}
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
