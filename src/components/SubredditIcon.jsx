import React from 'react';
import styled from 'styled-components';
import { string, bool } from 'prop-types';

const Icon = styled.img`
  border-radius: 1rem;
  width: ${(props) => props.small ? "24px" : "48px"}
`;

function SubredditIcon({ icon, small }) {
  return <Icon src={icon} small={small} />
}

SubredditIcon.defaultProps = {
  small: false,
};

SubredditIcon.propTypes = {
  icon: string.isRequired,
  small: bool,
};

export default SubredditIcon;
