import React, { useState } from 'react';
import { bool, func, string } from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/userSlice';
import logoutIcon from '../assets/logout_icon.png';
import UploadIconModal from './UploadIconModal';
import styled from 'styled-components';

const DropDown = styled.aside`
  position: absolute;
  top: 45px;
  right: 5px;
  display: ${(props) => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  font-size: 0.8rem;
  padding-left: 0px;
  hr {
    width: 100%;
    border: 1px solid var(--background-color);
  }


  a {
    display: grid;
    align-items: center;
    gap: 3px;
    grid-template-columns: 20px 1fr;
    padding: 10px;
    width: 100%;
    &:hover{
      background-color: var(--background-color);
    }
    img{
      width: 18px;
    }
    p{
      grid-column: 2 /3 ;
    }
  }
`;

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
      <DropDown className="main-child" visible={visible} onClick={closeFunc} data-testid="user-dropdown">
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
