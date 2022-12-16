import React from 'react';
import styled from 'styled-components';



interface IconLinkProps  {
  children: React.ReactNode;
  onClick: (e: MouseEvent) => void;
  data: string;
  round: boolean;
  fill: string;
  colored: boolean;
  className: string;
  ariaLabel: string;
};

const Button = styled.button<IconLinkProps>`
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

&> *{
  pointer-events: none;
}

&:hover{
  background-color: var(--background-color);
  color: var(--reddit-blue);
}

&.selected{
  background-color: var(--background-color);
  color: var(--reddit-blue);
  img{
    filter: invert(0.3) sepia(1) saturate(5) hue-rotate(175deg);
  }
}

${'' /* change svg color when hovering over area */}
&:hover{
  img{
    ${(props) => {
    if (props.fill !== '') {
      switch (props.fill) {
        case 'blue':
          return 'filter: invert(0.3) sepia(1) saturate(5) hue-rotate(175deg);';
        case 'orange':
          return 'filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg);';
        default:
          return '';
      }
    }
    return '';
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
    return '';
  }
}
}
`;


function IconLink({
  children,
  round= false,
  fill= '',
  onClick= (e: MouseEvent) => {},
  data= '',
  colored= false,
  className= "",
  ariaLabel= '',
}: IconLinkProps): JSX.Element {
  return (
    <Button
      round={round}
      fill={fill}
      onClick={onClick}
      colored={colored}
      data={data}
      className={className}
      data-testid="icon-link"
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}



export default IconLink;
