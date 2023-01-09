import React, { useState, useEffect, SyntheticEvent } from 'react';
import { subscribeToSubreddit, unsubscribeFromSubreddit } from '../../api/users';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, addUser } from '../../store/userSlice';
import Button from '../Button';
import { selectSubreddits } from '../../store/subredditsSlice';
import loadingIcon from '../../assets/loading.gif';

interface JoinButtonProps {
  subreddit: string;
};


function JoinButton({ subreddit }: JoinButtonProps): JSX.Element {
  const user = useSelector(selectUser);
  const subreddits = useSelector(selectSubreddits);
  // This keeps track of user.subreddit on the client side
  // so as to update the "join" button.
  const [userSubreddits, setUserSubreddits] = useState<string[]>([]);
  const [joinedText, setJoinedText] = useState('Joined');
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();
  const subredditId = subreddits[subreddit]._id;

  async function updateUserStore(updatedUser: IUser): Promise<void> {
    dispatch(addUser({ user: updatedUser, token: user.token }));
    setLoadingData(false);
  }

  async function changeSubscription(e: SyntheticEvent): Promise<void> {
    setLoadingData(true);
    if (userSubreddits.includes(subredditId)) {
      setUserSubreddits((prev) => {
        const newList = prev.filter((sub) => sub !== subreddit);
        return newList;
      });
      unsubscribeFromSubreddit(subredditId, user)
        .then((data) => {
          // Check if data contains a user
          if(data.user !== undefined){
            updateUserStore(data.user)
              .then()
              .catch((error) => console.log(error));
          };
        })
        .catch((error) => console.log(error));
    } else {
      setUserSubreddits((prev) => prev.concat(subreddit));
      subscribeToSubreddit(subredditId, user)
        .then((data) => {
          // Check if data contains a user
          if(data.user !== undefined){
            updateUserStore(data.user)
              .then()
              .catch((error) => console.log(error));
          };
        })
        .catch((error) => console.log(error));
    }
  }

  useEffect(() => {
    if (user.communities !== undefined) {
      setUserSubreddits(user.communities as string[]);
    }
  }, [user]);

  return userSubreddits.includes(subredditId) ? (
    <Button
      onClick={changeSubscription}
      onMouseEnter={() => {
        setJoinedText("Leave");
      }}
      onMouseLeave={() => {
        setJoinedText("Joined");
      }}
      light
    >
      {loadingData ? <img src={loadingIcon} alt="" /> : joinedText}
      </Button>
  ) : (
    <Button onClick={changeSubscription}>
      {loadingData ? <img src={loadingIcon} alt="" /> : "Join"}
    </Button>
  );
}



export default JoinButton;
