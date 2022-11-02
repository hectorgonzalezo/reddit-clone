import React from 'react';
import {
  arrayOf,
  objectOf,
  oneOfType,
  string,
  number,
  array,
} from 'prop-types';
import uniqid from 'uniqid';
import Comment from './Comment';

function CommentsDisplay({ comments, subreddit, postId }) {
  return (
    <div id="comments-display" data-testid="comments-display">
      {comments.map((comment, commentIndex) => (
        <Comment
          key={uniqid()}
          commentsList={comments}
          commentIndex={[0]}
          comment={comment}
          subreddit={subreddit}
          postId={postId}
        />
      ))}
    </div>
  );
}

CommentsDisplay.defaultProps = {
  comments: [],
};

CommentsDisplay.propTypes = {
  comments: arrayOf(objectOf(oneOfType([string, number, array]))),
  subreddit: string.isRequired,
  postId: string.isRequired,
};

export default CommentsDisplay;
