import React from 'react';
import { bool, func, string, arrayOf, element, oneOfType } from 'prop-types';
import styled from 'styled-components';

const Aside = styled.aside`
  position: absolute;
  top: 45px;
  right: 5px;
  display: ${(props) => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  font-size: 0.8rem;
  padding-left: 0px;
  padding-right: 0px;
  z-index: 10;
  max-height: 250px;
  overflow: scroll;
  hr {
    width: 90%;
    border: 1px solid var(--background-color);
  }

  .App & > a {
    display: grid;
    align-items: center;
    gap: px;
    grid-template-columns: 32px 1fr;
    padding: 5px 10px 5px 10px;
    width: 100%;
    &:hover{
      background-color: var(--background-color);
      cursor: pointer;
    }
    img{
      width: 32px;

    }
    p{
      grid-column: 2 /3 ;
    }
  }
`;
function DropDown({ visible, closeFunc, testid, children }) {
  return (
    <Aside
      className="main-child drop-down"
      visible={visible}
      onClick={closeFunc}
      data-testid={testid}
    >
      {children}
    </Aside>
  );
}

DropDown.defaultProps = {
  testid: '',
};

DropDown.propTypes = {
  visible: bool.isRequired,
  closeFunc: func.isRequired,
  testid: string,
  children: arrayOf(oneOfType([element, arrayOf(element)])).isRequired,
};

export default DropDown;
