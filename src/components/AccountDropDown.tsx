import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/userSlice';
import { authorization } from '../firebase/firebase';
import logoutIcon from '../assets/logout_icon.png';
import { toggleChangeIconModal } from '../store/changeIconModalSlice';
import { toggleAddCommunityModal } from '../store/addCommunityModalSlice';
import DropDown from './DropDown';

interface AccountDropDownProps {
  visible: boolean,
  closeFunc: () => void,
  userIcon: string,
};

function AccountDropDown({ visible, closeFunc, userIcon }: AccountDropDownProps): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Log out current user
  function logOut(): void {
    dispatch(removeUser());
    closeFunc();
    authorization
      .logOut()
      .then(() => {
        // On log out, go to homepage
        navigate("/");
      })
      .catch((error) => console.log(error));
  }

  return (
    <DropDown visible={visible} closeFunc={closeFunc} testid="user-dropdown">
      <a onClick={() => dispatch(toggleChangeIconModal())}>
        <img src={userIcon} alt="" className="user-icon" />
        <p>Change icon</p>
      </a>
      <hr />
      <a onClick={() => dispatch(toggleAddCommunityModal())}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/default_icon.svg?alt=media&token=b65c667b-5299-404a-b8d9-5d94c580936d"
          alt=""
          className="user-icon"
        />
        <p>Create community</p>
      </a>
      <hr />
      <a onClick={logOut} data-testid="logout-link">
        <img src={logoutIcon} alt="" />
        <p>Log out</p>
      </a>
    </DropDown>
  );
}


export default AccountDropDown;
