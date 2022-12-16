import React from 'react';
import Comment from './Comment';

interface CommentsDisplayProps {
  comments: IComment[];
  subreddit: string;
  postId: string;
  reloadPost: () => void;
};


function CommentsDisplay({
  comments = [],
  subreddit,
  postId,
  reloadPost,
}: CommentsDisplayProps): JSX.Element {
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


export default CommentsDisplay;
