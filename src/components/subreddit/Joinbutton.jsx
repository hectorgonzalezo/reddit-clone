import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectUser, addUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import Button from '../Button';

function JoinButton({ subreddit }) {
  const user = useSelector(selectUser);
  // This keeps track of user subreddits on the client side
  // so as to update the "join" button.
  const [userSubreddits, setUserSubreddits] = useState([]);
  const dispatch = useDispatch();

  async function updateUserStore() {
      const updatedUser = await database.getUser(user.username);
      dispatch(addUser(updatedUser));
  }

  async function changeSubscription(e) {
    const type = e.target.innerText;
    if (type === 'Join') {
      setUserSubreddits((prev) => prev.concat(subreddit));
      await database.subscribeToSubreddit(subreddit, user.username);
      await updateUserStore()
    } else if (type === 'Joined') {
      setUserSubreddits((prev) => {
        const newList = prev.filter((sub) => sub !== subreddit)
        return newList;
      });
      await database.unsubscribeFromSubreddit(subreddit, user.username);
      await updateUserStore()
    }
  }

  useEffect(() => {
    if (user.subreddits !== undefined) {
      setUserSubreddits(user.subreddits);
    }
  }, [user])


  return (
    user !== undefined && userSubreddits.includes(subreddit) ? (
      <Button onClick={changeSubscription} light>
        Joined
      </Button>
    ) : (
      <Button onClick={changeSubscription} >
        Join
      </Button>
    )
  )
}

JoinButton.propTypes = {
  subreddit: string.isRequired,
};

export default JoinButton;
