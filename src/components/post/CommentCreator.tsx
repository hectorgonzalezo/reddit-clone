import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { createComment } from '../../api/comments';
import loadingIcon from '../../assets/loading.gif';
import Button from '../Button';

interface CommentCreatorProps {
  commentsList?: IComment[];
  index?: number[];
  parentId: undefined | string;
  subreddit: string;
  postId: string;
  value?: string;
  edit?: boolean;
  reloadPost: () => void;
};

function CommentCreator({
  commentsList = [],
  index= [],
  parentId,
  subreddit,
  postId,
  value = '',
  edit = false,
  reloadPost,
}: CommentCreatorProps): JSX.Element {
  const user: IUser = useSelector(selectUser);
  const [textContent, setTextContent] = useState(value);
  const [isloadingg, setIsLoading] = useState(false);


  function addComment(): void {
    setIsLoading(true);
    const copiedComments = [...commentsList];
    let indexesList: number[];
    if (edit) {
      indexesList = index.slice(0, index.length);
    } else {
      indexesList = index;
    }
    // access specific location where comment should be in commentsList
    const locationToAdd= indexesList.reduce(
      (prev: any, curr, i) => {
      // dont acces responses if its the last element and it's editing the post
      if (i === indexesList.length - 1 && edit) {
        return prev[curr] as IComment;
      }
      return prev[curr].responses;
    }, copiedComments);

    // if you're editing a previous post, just update its text content
    if (edit) {
      locationToAdd.text = textContent;
    } else {
          // Add comment to database
    createComment(postId, {
      text: textContent,
      user: user._id,
      parent: parentId,
    }, user.token)
      .then((result) => {
        setIsLoading(false);
        reloadPost();
      })
      .catch((error) => console.log(error));
    }


  }

  return (
    <div id="create-post-area" data-testid="create-post-area">
      <p>
        Comment as <Link to={`/u/${user._id.toString() as string}`}>{user.username}</Link>
      </p>
      <form action="">
        <textarea
          id="text-area"
          rows={5}
          placeholder="What are your thoughts?"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />
        <Button disabled={textContent === ""} onClick={addComment}>
          {isloadingg ? (
            <img src={loadingIcon} alt="" className="loading-icon" />
          ) : (
            "Reply"
          )}
        </Button>
      </form>
    </div>
  );
}


export default CommentCreator;
