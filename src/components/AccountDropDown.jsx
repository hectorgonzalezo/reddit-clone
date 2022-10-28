import React, { useState } from 'react';
import { bool, func, string } from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/userSlice';
import logoutIcon from '../assets/logout_icon.png';
import UploadIconModal from './UploadIconModal';
import DropDown from './DropDown';

function AccountDropDown({ visible, closeFunc, onClickLogout, userIcon }) {
  const dispatch = useDispatch();
  const [iconModalVisible, setIconModalVisible] = useState(false);

  function toggleIconModal() {
    setIconModalVisible((prev) => !prev);
  }

  // Log out current user
  function logOut() {
    dispatch(removeUser());
    onClickLogout();
  };

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
  onClickLogout: func.isRequired,
  closeFunc: func.isRequired,
  userIcon: string.isRequired,
};

export default AccountDropDown;
