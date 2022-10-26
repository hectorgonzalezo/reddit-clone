import React from 'react';
import { string, bool, func, arrayOf, oneOfType, element} from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: none;
  background-color: ${(props) => props.light ? 'white' : 'var(--reddit-blue)'};
  outline: ${(props) => props.light ? '0.1rem solid var(--reddit-blue)' : ''};
  color: ${(props) => props.light ? 'var(--reddit-blue)' : 'white'};
  border-radius: 1rem;
  padding: 6px 13px 6px 13px;
  font-family: inherit;
  font-weight: bold;
  font-size: 0.8rem;
  &:hover{
    background-color: ${(props) => props.light ? 'var(--reddit-blue-super-light)' : 'var(--reddit-blue-light)'};
  }

  &:disabled{
    opacity: 0.5
  }
`;

function Button({ text, light, onClick, type, disabled, children }) {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      light={light}
      className="default-button"
      disabled={disabled}
    >
      {text}
      {children}
    </StyledButton>
  );
}

Button.defaultProps = {
  text: '',
  light: false,
  onClick: () => {},
  type: 'button',
  disabled: false,
  children: [],
};

Button.propTypes = {
  text: string,
  light: bool,
  onClick: func,
  type: string,
  disabled: bool,
  children: arrayOf(oneOfType([string, element])),
};

export default Button;
