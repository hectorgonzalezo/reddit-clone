import React from 'react';
import styled from 'styled-components';
import { arrayOf, element, bool, string, oneOfType } from 'prop-types';

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
  &:{
    filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);
  }
  &.selected{
    background-color: grey;
  }
}
`;

function IconLink({ children, round, fill }) {
  console.log({children})
  return (
    <Button round={round} fill={fill}>
      {children}
    </Button>
  )
}

IconLink.defaultProps = {
  round: false,
  fill: '',
};

IconLink.propTypes = {
  children: oneOfType([element, arrayOf(oneOfType([element, string]))]).isRequired,
  round: bool,
  fill: string,
};

export default IconLink;
