import React from 'react';
import {
  arrayOf,
  objectOf,
  oneOfType,
  string,
  number,
  array,
  func,
} from 'prop-types';
import Comment from './Comment';

function CommentsDisplay({ comments, subreddit, postId, reloadPost }) {
  return (
    <div id="comments-display" data-testid="comments-display">
      {comments.map((comment, commentIndex) => (
        <Comment
          key={commentIndex}
          commentsList={comments}
          commentIndex={[0]}
          comment={comment}
          subreddit={subreddit}
          postId={postId}
          reloadPost={reloadPost}
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
  reloadPost: func.isRequired,
};

export default CommentsDisplay;
