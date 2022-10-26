import React from 'react';
import styled from 'styled-components';

const DropDown = styled.aside`
`

function AccountDropDown() {
  return(
    <DropDown>
      <ul>
        <li>Change icon</li>
        <li>Log out</li>
      </ul>
    </DropDown>
  )  
}

export default AccountDropDown;
