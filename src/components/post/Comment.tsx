import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { selectUser } from '../../store/userSlice';
import CommentCreator from './CommentCreator';
import commentIcon from '../../assets/comments_icon.svg';
import { getUser } from '../../api/users';
import defaultUserIcon from '../../assets/user_icon.svg';

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
  const [userIcon, setUserIcon] = useState(defaultUserIcon);
  const [visibleCreator, setVisibleCreator] = useState(false);
  const [visibleEditor, setVisibleEditor] = useState(false);
  // commentIndex contains the index to find the comment in the nested
  // hierarchy of comments in the database

  // get user icon from database
  useEffect(() => {
    getUser(comment.user.toString()).then((fetchedUser) => {
      // if theres an icon, add it to state
      if (fetchedUser?.icon !== undefined) {
        // console.log()
        setUserIcon(fetchedUser.icon);
      }
    })
    .catch((error) => console.log(error));
  }, []);

  return (
    <div className="comment-inside" data-testid="comment">
      <div className="comment">
        <div className="poster-area">
          <img src={userIcon} className="user-icon" alt="user icon" />
          <a href="">{comment.user}</a>
          <p>
            &nbsp;•&nbsp;
            {formatDistanceToNow(new Date(comment.createdAt))}
            &nbsp;ago
          </p>
        </div>
        {visibleEditor ? (
          <CommentCreator
            commentsList={commentsList}
            value={comment.text}
            index={commentIndex}
            subreddit={subreddit}
            postId={postId}
            reloadPost={reloadPost}
            edit
          />
        ) : (
          <p>{comment.text}</p>
        )}
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
        {visibleCreator ? (
          <CommentCreator
            commentsList={commentsList}
            index={commentIndex}
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
