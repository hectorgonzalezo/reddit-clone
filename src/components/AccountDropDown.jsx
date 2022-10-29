import React, { useState } from 'react';
import { bool, func, string } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/userSlice';
import { authorization } from '../firebase/firebase';
import logoutIcon from '../assets/logout_icon.png';
import UploadIconModal from './UploadIconModal';
import DropDown from './DropDown';

function AccountDropDown({ visible, closeFunc, userIcon }) {
  const dispatch = useDispatch();
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const navigate = useNavigate();

  function toggleIconModal() {
    setIconModalVisible((prev) => !prev);
  }

  // Log out current user
  function logOut() {
    dispatch(removeUser());
    closeFunc();
    authorization.logOut();
    // On log out, go to homepage
    navigate('/');
  }

  return (
    <>
      <DropDown visible={visible} closeFunc={closeFunc} testid="user-dropdown">
        <a onClick={toggleIconModal}>
          <img src={userIcon} alt="" className="user-icon" />
          <p>Change icon</p>
        </a>
        <hr />
        <a onClick={logOut} data-testid="logout-link">
          <img src={logoutIcon} alt="" />
          <p>Log out</p>
        </a>
      </DropDown>
      {iconModalVisible ? (
        <UploadIconModal closeFunc={toggleIconModal} />
      ) : null}
    </>
  );
}

AccountDropDown.propTypes = {
  visible: bool.isRequired,
  closeFunc: func.isRequired,
  userIcon: string.isRequired,
};

export default AccountDropDown;
