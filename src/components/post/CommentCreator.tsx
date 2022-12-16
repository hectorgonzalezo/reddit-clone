import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import loadinIcon from '../../assets/loading.gif';
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
  const [isLoading, setIsLoading] = useState(false);

  function addComment(): void {
    setIsLoading(true);
    const copiedComments = [...commentsList];
    let indexesList: number[];
    if (edit) {
      indexesList = index.slice(0, index.length);
      // indexesList = index;
    } else {
      indexesList = index;
    }
    // access specific location where comment should be in commentsList
    const locationToAdd: IComment = indexesList.reduce((prev, curr, i) => {
      // dont acces responses if its the last elemen and it's editing the post
      if (i === indexesList.length - 1 && edit) {
        return prev[curr];
      }
      return prev[curr].responses;
    }, copiedComments);

    // if youre editing a previous post, just update its text content
    if (edit) {
      locationToAdd.text = textContent;
    } else {
      // add comment to that location;
      locationToAdd.push({
        content: textContent,
        timePosted: new Date().toString(),
        user: user.username,
        responses: [],
      });
    }

    // Add comment to database
    database
      .addComment(subreddit, postId, copiedComments)
      .then((result) => {
        setIsLoading(false);
        reloadPost();
      })
      .catch((error) => console.log(error));

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
          {isLoading ? (
            <img src={loadinIcon} alt="" className="loading-icon" />
          ) : (
            "Reply"
          )}
        </Button>
      </form>
    </div>
  );
}


export default CommentCreator;
