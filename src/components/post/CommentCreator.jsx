import React, { useState } from 'react';
import { number, string, arrayOf, objectOf, oneOfType, array, bool, func } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import loadinIcon from '../../assets/loading.gif';
import Button from '../Button';

function CommentCreator({ commentsList, index, subreddit, postId, value, edit, reloadPost }) {
  const user = useSelector(selectUser);
  const [textContent, setTextContent] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  async function addComment() {
    setIsLoading(true);
    const copiedComments = [...commentsList];
    let indexesList;
    if (edit) {
      indexesList = index.slice(0, index.length);
      // indexesList = index;
    } else {
      indexesList = index;
    }
    // access specific location where comment should be in commentsList
    const locationToAdd = indexesList.reduce(
      (prev, curr, i) => {
        // dont acces responses if its the last elemen and it's editing the post
        if (i === indexesList.length - 1 && edit) {
          return prev[curr];
        }
        return prev[curr].responses
      },
      copiedComments
    );

    // if youre editing a previous post, just update its text content
    if (edit) {
      locationToAdd.content = textContent;
    } else {
      // add comment to that location;
      locationToAdd.push({
        content: textContent,
        timePosted: new Date().toString(),
        user: user.username,
        responses: []
      });
    }

    await database.addComment(subreddit, postId, copiedComments);
    setIsLoading(false);
    reloadPost();
  }

  return (
    <div id="create-post-area" data-testid="create-post-area">
      <p>
        Comment as <a>{user.username}</a>
      </p>
      <form action="">
        <textarea
          id="text-area"
          rows="5"
          placeholder="What are your thoughts?"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />
        <Button disabled={textContent === ''} onClick={addComment}>
          {isLoading ? (
            <img src={loadinIcon} alt="" className="loading-icon" />
          ) : (
            'Reply'
          )}
        </Button>
      </form>
    </div>
  );
}

CommentCreator.defaultProps = {
  commentsList: [],
  index: [],
  value: '',
  edit: false,
};

CommentCreator.propTypes = {
  commentsList: arrayOf(objectOf(oneOfType([string, number, array]))),
  index: arrayOf(number),
  subreddit: string.isRequired,
  postId: string.isRequired,
  value: string,
  edit: bool,
  reloadPost: func.isRequired,
};

export default CommentCreator;
