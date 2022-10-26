import React from 'react';
import { bool, func} from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/userSlice';
import logoutIcon from '../assets/logout_icon.png';
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
    width: 100%;
    grid-template-columns: 20px 1fr;
    padding: 10px;
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

function AccountDropDown({ visible, onClickLogout }) {
  const dispatch = useDispatch();
  // Log out current user
  function logOut() {
    dispatch(removeUser());
    onClickLogout();
  };

  return (
    <DropDown className="main-child" visible={visible}>
      <a><p>Change icon</p></a>
      <hr />
      <a onClick={logOut}><img src={logoutIcon} alt="" /><p>Log out</p></a>
    </DropDown>
  )
}

AccountDropDown.propTypes = {
  visible: bool.isRequired,
  onClickLogout: func.isRequired,
};

export default AccountDropDown;
