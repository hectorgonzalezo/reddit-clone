import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, addUser } from '../../store/userSlice';
import { database } from '../../firebase/firebase';
import Button from '../Button';

interface JoinButtonProps {
  subreddit: string;
};


function JoinButton({ subreddit }: JoinButtonProps): JSX.Element {
  const user = useSelector(selectUser);
  // This keeps track of user subreddits on the client side
  // so as to update the "join" button.
  const [userSubreddits, setUserSubreddits] = useState<string[]>([]);
  const [joinedText, setJoinedText] = useState('Joined');
  const dispatch = useDispatch();

  async function updateUserStore(): Promise<void> {
    const updatedUser = await database.getUser(user.username);
    dispatch(addUser(updatedUser));
  }

  async function changeSubscription(e: MouseEvent): Promise<void> {
    if (userSubreddits.includes(subreddit)) {
      setUserSubreddits((prev) => {
        const newList = prev.filter((sub) => sub !== subreddit);
        return newList;
      });
      database.unsubscribeFromSubreddit(subreddit, user.username)
        .then((data) => {
          updateUserStore()
            .then()
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      setUserSubreddits((prev) => prev.concat(subreddit));
      database.subscribeToSubreddit(subreddit, user.username)
        .then((data) => {
          updateUserStore()
            .then()
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
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
}



export default JoinButton;
