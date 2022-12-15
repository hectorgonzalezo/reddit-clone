import React, { useState, useRef, useEffect } from 'react';
import hotIcon from '../assets/hot_icon.svg';
import newIcon from '../assets/new_icon.svg';
import topIcon from '../assets/top_icon.svg';
import IconLink from './IconLink';
import { func } from 'prop-types';

function PopularPostsBar({ changeOrder }) {
  // a mode is one of the choices in bar: Hot, New, Top, etc.
  const [mode, setMode] = useState('hot');

  function changeMode(e) {
    const newMode = e.target.getAttribute('data');
    setMode(newMode);
    changeOrder(newMode)
  }

  return (
    <div id="popular-bar" className="main-child">
      <IconLink
        round
        className={mode === 'hot' ? 'selected' : ''}
        fill="blue"
        onClick={changeMode}
        data="hot"
      >
        <img src={hotIcon} alt="" />
        Hot
      </IconLink>
      <IconLink
        round
        className={mode === 'new' ? 'selected' : ''}
        fill="blue"
        onClick={changeMode}
        data="new"
      >
        <img src={newIcon} alt="" />
        New
      </IconLink>
      <IconLink
        round
        className={mode === 'top' ? 'selected' : ''}
        fill="blue"
        onClick={changeMode}
        data="top"
      >
        <img src={topIcon} alt="" />
        Top
      </IconLink>
    </div>
  );
}

PopularPostsBar.propTypes = {
  changeOrder: func.isRequired,
};

export default PopularPostsBar;
