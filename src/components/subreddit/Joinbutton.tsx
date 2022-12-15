import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, addUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import Button from '../Button';

function JoinButton({ subreddit }) {
  const user = useSelector(selectUser);
  // This keeps track of user subreddits on the client side
  // so as to update the "join" button.
  const [userSubreddits, setUserSubreddits] = useState([]);
  const [joinedText, setJoinedText] = useState('Joined');
  const dispatch = useDispatch();

  async function updateUserStore() {
    const updatedUser = await database.getUser(user.username);
    dispatch(addUser(updatedUser));
  }

  async function changeSubscription(e) {
    if (userSubreddits.includes(subreddit)) {
      setUserSubreddits((prev) => {
        const newList = prev.filter((sub) => sub !== subreddit)
        return newList;
      });
      await database.unsubscribeFromSubreddit(subreddit, user.username);
      await updateUserStore();
    } else {
      setUserSubreddits((prev) => prev.concat(subreddit));
      await database.subscribeToSubreddit(subreddit, user.username);
      await updateUserStore();
    }
  }

  useEffect(() => {
    if (user.subreddits !== undefined) {
      setUserSubreddits(user.subreddits);
    }
  }, [user]);

  if (user.username !== undefined) {
  return  userSubreddits.includes(subreddit) ? (
    <Button
      text={joinedText}
      onClick={changeSubscription}
      onMouseEnter={() => {
        setJoinedText("Leave");
      }}
      onMouseLeave={() => {
        setJoinedText("Joined");
      }}
      light
    />
    ) : (
    <Button onClick={changeSubscription}>Join</Button>
  );
  }
  return;
}

JoinButton.propTypes = {
  subreddit: string.isRequired,
};

export default JoinButton;
