import React, { useState, useEffect } from 'react';
import {
  number,
  objectOf,
  oneOfType,
  string,
  array,
} from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import uniqid from 'uniqid';
import styled from 'styled-components';
import commentIcon from '../../assets/comments_icon.svg';
import { database } from '../../firebase/firebase';
import defaultUserIcon from '../../assets/user_icon.svg';

const IndentedComment = styled.div`
  margin-left: ${(props) => 15 * props.indentation}px;
`;

function Comment({ comment, indentation }) {
  const [userIcon, setUserIcon] = useState(defaultUserIcon);

  // get user icon from database
  useEffect(() => {
    // console.log(comment.user)
    database.getUser(comment.user)
      .then((user) => {
      // if theres an icon, add it to state
        if (user !== undefined && user.icon !== undefined) {
          setUserIcon(user.icon);
        }
      }
      );
  }, []);

  return (
    <IndentedComment className="comment-inside" data-testid="comment" indentation={indentation}>
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
        <div>
          <p>{comment.content}</p>
        </div>
        <button type="button">
          <img src={commentIcon} alt="" className="icon" />
          <p>Reply</p>
        </button>
      </div>
      {/* show responses if there are any */}
      {comment.responses !== undefined
        ? comment.responses.map((response) => (
          <Comment
            key={uniqid()}
            comment={response}
            indentation={indentation + 1}
          />
        ))
        : null}
    </IndentedComment>
  );
}

Comment.defaultProps = {
  indentation: 0,
};

Comment.propTypes = {
  indentation: number,
  comment: objectOf(oneOfType([string, number, array])).isRequired,
};

export default Comment;
