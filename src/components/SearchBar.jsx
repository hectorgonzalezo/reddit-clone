import React, { useState } from 'react';
import xCircle from '../assets/x_circle.svg';
import searchIcon from '../assets/search_icon.svg';

function SearchBar() {
  const [text, setText] = useState('');

  // called by x-circle
  function clearText() {
    setText('')
  }

  return (
    <div id="search-bar" className="main-input">
      <img src={searchIcon} alt="" className="icon" />
      <input
        type="text"
        placeholder="Search Reddit"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {/* only render x-circle when theres a text in input */}
      {text !== '' ? (
        <button type="button" id="x-circle" onClick={clearText}>
          <img src={xCircle} alt="erase" />
        </button>
      ) : null}
    </div>
  );
}

export default SearchBar;
