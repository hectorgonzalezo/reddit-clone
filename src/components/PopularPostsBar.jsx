import React, { useState, useRef, useEffect } from 'react';
import hotIcon from '../assets/hot_icon.svg';
import newIcon from '../assets/new_icon.svg';
import topIcon from '../assets/top_icon.svg';
import cardIcon from '../assets/card_icon.svg';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import styled from 'styled-components';

const FilterButton = styled.button`
border: none;
display: flex;
align-items: center;
justify-content: space-between;
gap: 3px;
background-color: white;
border-radius: 0.8rem;
color: var(--grey-dark);
font-size: 0.9rem;
font-weight: bold;

&:hover{
  background-color: var(--background-color);
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

function PopularPostsBar() {
  return (
    <div id="popular-bar" className="main-child">
      <FilterButton type="FilterButton">
        <img src={hotIcon} alt="" />
        Hot
      </FilterButton>
      <FilterButton type="FilterButton">
        <img src={newIcon} alt="" />
        New
      </FilterButton>
      <FilterButton type="FilterButton">
        <img src={topIcon} alt="" />
        Top
      </FilterButton>
      <FilterButton>
        <img src={cardIcon} alt="" />
        <img src={arrowDownIcon} alt="" className="icon" />
      </FilterButton>
    </div>
  );
}

export default PopularPostsBar;
