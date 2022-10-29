import React from 'react';
import styled from 'styled-components';
import { arrayOf, element, bool, string, oneOfType, func } from 'prop-types';

const Button = styled.button`
border: none;
display: flex;
align-items: center;
justify-content: space-between;
gap: 3px;
background-color: white;
border-radius: ${(props) => props.round ? '0.8rem' : '0rem'};
color: var(--grey-dark);
font-size: 0.9rem;
font-weight: bold;

&:hover{
  background-color: var(--background-color);
}

${'' /* change svg color when hovering over area */}
&:hover{
  img{
    ${(props) => {
    if (props.fill !== '') {
      switch (props.fill) {
        case 'blue':
          return 'filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);';
        case 'orange':
          return 'filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg);';
        default:
          return '';
      }
    }
  }}
  }
}


img {
  width: 28px;
  &.selected{
    background-color: grey;
  }
  ${(props) => {
    if (props.colored) {
      switch (props.fill) {
        case 'blue':
          return 'filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);';
        case 'orange':
          return 'filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg);';
        default:
          return '';
      }
    }
  }
}
`;

function IconLink({ children, round, fill, onClick, data, colored }) {
  return (
    <Button
      round={round}
      fill={fill}
      onClick={onClick}
      colored={colored}
      data={data !== '' ? data : null}
    >
      {children}
    </Button>
  );
}

IconLink.defaultProps = {
  round: false,
  onClick: () => {},
  data: '',
  fill: '',
  colored: false,
};

IconLink.propTypes = {
  children: oneOfType([element, arrayOf(oneOfType([element, string]))]).isRequired,
  onClick: func,
  data: string,
  round: bool,
  fill: string,
  colored: bool,
};

export default IconLink;
