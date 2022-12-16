import React from 'react';
import styled from 'styled-components';

interface SubredditIconProps {
  icon: string;
  small?: boolean;
  subredditName?: string;
};

interface IconProps {
  src: string;
  small: boolean;
  alt: string;
}

const Icon = styled.img<IconProps>`
  border-radius: 100%;
  width: ${(props) => props.small ? "24px" : "48px"};
  background-color: white;
`;
function SubredditIcon({
  icon,
  small= false,
  subredditName = '',
}: SubredditIconProps): JSX.Element {
  return <Icon src={icon} small={small} alt={subredditName} />;
}

export default SubredditIcon;
