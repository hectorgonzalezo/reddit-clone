import React from 'react';
import styled from 'styled-components';
import { string, bool } from 'prop-types';

const Icon = styled.img`
  border-radius: 100%;
  width: ${(props) => props.small ? "24px" : "48px"};
  background-color: white;
`;

function SubredditIcon({ icon, small, subredditName}) {
  return <Icon src={icon} small={small} alt={subredditName} />
}

SubredditIcon.defaultProps = {
  small: false,
  subredditName: '',
};

SubredditIcon.propTypes = {
  icon: string.isRequired,
  small: bool,
  subredditName: string,
};

export default SubredditIcon;
