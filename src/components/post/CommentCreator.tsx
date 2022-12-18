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
  subreddit: string;
  postId: string;
  value?: string;
  edit?: boolean;
  reloadPost: () => void;
};

function CommentCreator({
  commentsList = [],
  index= [],
  subreddit,
  postId,
  value = '',
  edit = false,
  reloadPost,
}: CommentCreatorProps): JSX.Element {
  const user: IUser = useSelector(selectUser);
  const [textContent, setTextContent] = useState(value);
  const [isloadingg, setIsLoading] = useState(false);

  // Typecheck locationToAdd
  function isComment(location: IComment | []): location is IComment {
    return (location as IComment).text !== undefined;
  }

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
    // const locationToAdd= indexesList.reduce(
    //   (prev: IComment[], curr, i) => {
    //   // dont acces responses if its the last element and it's editing the post
    //   if (i === indexesList.length - 1 && edit) {
    //     return prev[curr] as IComment;
    //   }
    //   return prev[curr].responses;
    // }, copiedComments);

    // // if you're editing a previous post, just update its text content
    // if (edit && isComment(locationToAdd)) {
    //   locationToAdd.text = textContent;
    // } else if(!isComment(locationToAdd)){
    //   // add comment to that location;
    //   locationToAdd.push({
    //     content: textContent,
    //     user: user.username,
    //     responses: [],
    //   });
    // }

    // // Add comment to database
    // createComment(subreddit, postId, comment, parent)
    //   .then((result) => {
    //     setIsLoading(false);
    //     reloadPost();
    //   })
    //   .catch((error) => console.log(error));

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
