import React, { useState, useRef, useEffect } from 'react';
import hotIcon from '../assets/hot_icon.svg';
import newIcon from '../assets/new_icon.svg';
import topIcon from '../assets/top_icon.svg';
import cardIcon from '../assets/card_icon.svg';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import IconLink from './IconLink';

function PopularPostsBar() {
  return (
    <div id="popular-bar" className="main-child">
      <IconLink round>
        <img src={hotIcon} alt="" />
        Hot
      </IconLink>
      <IconLink round>
        <img src={newIcon} alt="" />
        New
      </IconLink>
      <IconLink round>
        <img src={topIcon} alt="" />
        Top
      </IconLink>
      <IconLink round>
        <img src={cardIcon} alt="" />
        <img src={arrowDownIcon} alt="" className="icon" />
      </IconLink>
    </div>
  );
}

export default PopularPostsBar;
