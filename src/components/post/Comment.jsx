import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  number,
  objectOf,
  oneOfType,
  string,
  array,
  arrayOf,
  func,
} from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { selectUser } from '../../store/userSlice';
import CommentCreator from './CommentCreator';
import commentIcon from '../../assets/comments_icon.svg';
import { database } from '../../firebase/firebase';
import defaultUserIcon from '../../assets/user_icon.svg';


function Comment({
  comment,
  commentsList,
  commentIndex,
  subreddit,
  postId,
  reloadPost,
}) {
  const user = useSelector(selectUser);
  const [userIcon, setUserIcon] = useState(defaultUserIcon);
  const [visibleCreator, setVisibleCreator] = useState(false);
  const [visibleEditor, setVisibleEditor] = useState(false);
  // commentIndex contains the index to find the comment in the nested
  // hierarchy of comments in the database

  // get user icon from database
  useEffect(() => {
    database.getUser(comment.user).then((fetchedUser) => {
    // if theres an icon, add it to state
      if (fetchedUser !== undefined && fetchedUser.icon !== undefined) {
        setUserIcon(user.icon);
      }
    });
  }, []);

  return (
    <div className="comment-inside" data-testid="comment">
      <div className="comment">
        <div className="poster-area">
          <img src={userIcon} className="user-icon" alt="user icon" />
          <a href="">{comment.user}</a>
          <p>
            &nbsp;•&nbsp;
            {formatDistanceToNow(new Date(comment.timePosted))}
            &nbsp;ago
          </p>
        </div>
        {visibleEditor ? (
          <CommentCreator
            commentsList={commentsList}
            value={comment.content}
            index={commentIndex}
            subreddit={subreddit}
            postId={postId}
            reloadPost={reloadPost}
            edit
          />
        ) : (
          <p>{comment.content}</p>
        )}
        <div>
          <button
            type="button"
            onClick={() => setVisibleCreator((prev) => !prev)}
          >
            <img src={commentIcon} alt="" className="icon" />
            <p>Reply</p>
          </button>
          {comment.user === user.username ? (
            <button
              type="button"
              onClick={() => setVisibleEditor((prev) => !prev)}
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


Comment.propTypes = {
  commentsList: arrayOf(objectOf(oneOfType([string, number, array]))).isRequired,
  commentIndex: arrayOf(number).isRequired,
  comment: objectOf(oneOfType([string, number, array])).isRequired,
  subreddit: string.isRequired,
  postId: string.isRequired,
  reloadPost: func.isRequired,
};

export default Comment;
