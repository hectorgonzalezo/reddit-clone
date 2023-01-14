import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { selectUser } from '../../store/userSlice';
import CommentCreator from './CommentCreator';
import commentIcon from '../../assets/comments_icon.svg';
import defaultUserIcon from '../../defaultUserIcon';
import { Link } from 'react-router-dom';

interface CommentProps {
  commentsList: IComment[];
  commentIndex: number[];
  comment: IComment;
  subreddit: string;
  postId: string;
  reloadPost: () => void;
};


function Comment({
  comment,
  commentsList = [],
  commentIndex = [0],
  subreddit,
  postId,
  reloadPost,
}: CommentProps): JSX.Element {
  const user = useSelector(selectUser);
  const [visibleCreator, setVisibleCreator] = useState(false);
  const [visibleEditor, setVisibleEditor] = useState(false);
  console.log(comment.user)

  return (
    <div className="comment-inside" data-testid="comment">
      <div className="comment">
        <div className="poster-area">
          <img
            src={
              comment.user.icon !== undefined
                ? comment.user.icon
                : defaultUserIcon
            }
            className="user-icon"
            alt="user icon"
          />
          <Link to={`/u/${comment.user._id}`}>{comment.user.username}</Link>
          <p>
            &nbsp;•&nbsp;
            {formatDistanceToNow(new Date(comment.createdAt as string))}
            &nbsp;ago
          </p>
        </div>
        {visibleEditor ? (
          <CommentCreator
            commentsList={commentsList}
            value={comment.text}
            parentId={comment._id}
            index={commentIndex}
            subreddit={subreddit}
            postId={postId}
            reloadPost={reloadPost}
            edit
          />
        ) : (
          <p>{comment.text}</p>
        )}
        {user._id !== undefined ? (
          <div>
            <button
              type="button"
              onClick={() => setVisibleCreator((prev) => !prev)}
              data-testid="reply-button"
            >
              <img src={commentIcon} alt="" className="icon" />
              <p>Reply</p>
            </button>
            {comment.user === user._id.toString() ? (
              <button
                type="button"
                onClick={() => setVisibleEditor((prev) => !prev)}
                data-testid="edit-button"
              >
                <p>Edit</p>
              </button>
            ) : null}
          </div>
        ) : null}
        {visibleCreator ? (
          <CommentCreator
            commentsList={commentsList}
            index={commentIndex}
            parentId={comment._id}
            subreddit={subreddit}
            postId={postId}
            reloadPost={reloadPost}
          />
        ) : null}
      </div>
      {/* show responses if there are any */}
      {comment.responses !== undefined
        ? comment.responses.map((response, newIndex) => (
            <Comment
              key={newIndex}
              commentsList={commentsList}
              commentIndex={commentIndex.concat(newIndex)}
              comment={response}
              subreddit={subreddit}
              postId={postId}
              reloadPost={reloadPost}
            />
          ))
        : null}
    </div>
  );
}



export default Comment;
