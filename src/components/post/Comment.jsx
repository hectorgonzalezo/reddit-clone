import React, { useState, useEffect } from 'react';
import {
  arrayOf,
  objectOf,
  oneOfType,
  string,
  number,
  array,
} from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { database } from '../../firebase/firebase';

function Comment({ comment }) {
  const [userIcon, setUserIcon] = useState('');

  // get user icon from database
  useEffect(() => {
    database.getUser(comment.user).then((user) => setUserIcon(user.icon));
  }, []);

  return (
    <div className="comment">
      <div className="poster-area">
        {userIcon !== '' ? <img src={userIcon} className="user-icon" alt="user icon" /> : null}
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
    </div>
  );
}

Comment.propTypes = {
  comment: objectOf(oneOfType([string, number, array])).isRequired,
};

export default Comment;
