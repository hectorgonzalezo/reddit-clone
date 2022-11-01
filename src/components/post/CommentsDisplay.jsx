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

function CommentsDisplay({ comments }) {
  return (
    <div id="comments-display" data-testid="comments-display">
      {comments.map((comment) => <Comment key={uniqid()} comment={comment} />)}
    </div>
  );
}

CommentsDisplay.defaultProps = {
  comments: [],
};

CommentsDisplay.propTypes = {
  comments: arrayOf(objectOf(oneOfType([string, number, array]))),
};

export default CommentsDisplay;
