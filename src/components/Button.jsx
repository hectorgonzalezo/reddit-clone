import React from 'react';
import { string, bool, func } from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: none;
  background-color: ${(props) => props.light ? 'white' : 'var(--reddit-blue)'};
  outline: ${(props) => props.light ? '0.1rem solid var(--reddit-blue)' : ''};
  color: ${(props) => props.light ? 'var(--reddit-blue)' : 'white'};
  border-radius: 1rem;
  padding: 4px 13px 4px 13px;
  font-family: inherit;
  font-weight: bold;
  font-size: 0.8rem;
  &:hover{
    background-color: ${(props) => props.light ? 'var(--reddit-blue-super-light)' : 'var(--reddit-blue-light)'};
  }
`;

function Button({ text, light, onClick }) {
  return <StyledButton type="button" onClick={onClick} light={light} className="default-button">{text}</StyledButton>;
}

Button.defaultProps = {
  text: '',
  light: false,
  onClick: () => {},
};

Button.propTypes = {
  text: string,
  light: bool,
  onClick: func,
};

export default Button;
