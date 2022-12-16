import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  text?: string;
  data?: string | null;
  light?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
  onClick: (e: SyntheticEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const StyledButton = styled.button<ButtonProps>`
  border: none;
  background-color: ${(props) => props.light ? 'white' : 'var(--reddit-blue)'};
  outline: ${(props) => props.light ? '0.1rem solid var(--reddit-blue)' : ''};
  color: ${(props) => props.light ? 'var(--reddit-blue)' : 'white'};
  border-radius: 1rem;
  padding: 6px 13px 6px 13px;
  font-family: inherit;
  font-weight: bold;
  font-size: 0.8rem;
  &:hover:not(:disabled){
    background-color: ${(props) => props.light ? 'var(--reddit-blue-super-light)' : 'var(--reddit-blue-light)'};
  }

  &:disabled{
    opacity: 0.5;
  }
`;

function Button({
  text = '',
  data = '',
  light= false,
  type= "button",
  disabled= false,
  children= [],
  onClick= (e: SyntheticEvent) => {},
  onMouseEnter= () => {},
  onMouseLeave= () => {},
}: ButtonProps): JSX.Element {
  return (
    <StyledButton
      type={type}
      light={light}
      className="default-button"
      disabled={disabled}
      data={data}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      value={text}
    >
      {text}
      {children}
    </StyledButton>
  );
  };


export default Button;
