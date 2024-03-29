import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { selectSubreddits } from '../store/subredditsSlice';
import { getUser } from '../api/users';
import Agreements from './Agreements';
import Button from './Button';
import PostsArea from './post/PostsArea';
import defaultUserIcon from '../defaultUserIcon';

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  img{
    max-width: 64px;
    max-height: 64px;
  }
  h1{
    font-size: 1.5rem;
    &:before{
      content: 'u/'
    }
  }
`;

function UserDisplay(): JSX.Element {
  const { userId } = useParams();
  const subreddits = useSelector(selectSubreddits);
  const [user, setUser] = useState<IUser>();

  // get Info about user
  useEffect(() => {
      getUser(userId as string)
      .then((data) => {
        if (data !== undefined) {
          setUser(data.user);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div id="left-side">
        {user !== undefined && subreddits? 
        <PostsArea subreddits={subreddits} order="new" onlyUser />
        :null}
      </div>
      <div id="right-side">
        <UserInfo className="main-child">
          {user !== undefined ? (
            <>
              <img src={user.icon !== undefined ?  user.icon : defaultUserIcon} alt="" />
              <h1>{user.username}</h1>
            </>
          ) : null}
        </UserInfo>
        <Agreements />
        <Button
          text="Back to Top"
          onClick={() => window.scrollTo({ top: 0 })}
        />
      </div>
    </>
  );
};

export default UserDisplay;
