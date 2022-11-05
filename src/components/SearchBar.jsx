import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubredditsDropDown from './subreddit/SubredditsDropDown';
import xCircle from '../assets/x_circle.svg';
import searchIcon from '../assets/search_icon.svg';

function SearchBar() {
  const [text, setText] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  function toggleDropdown() {
    setDropdownVisible((prev) => !prev);
  }

  function navigateToSubreddit(e) {
    const chosenSubreddit = e.target.getAttribute('data');
    navigate(`/r/${chosenSubreddit}`);
    toggleDropdown();
  }

  // called by x-circle
  function clearText() {
    setText('')
  }

  return (
    <div id="search-bar" className="main-input" onClick={toggleDropdown} onMouseLeave={() => setDropdownVisible(false)}>
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
      <SubredditsDropDown
        dropdownVisible={dropdownVisible}
        toggleDropdown={toggleDropdown}
        chooseFromDropdown={navigateToSubreddit}
        filterBy={text}
        header
        search
        />
    </div>
  );
}

export default SearchBar;
