import React, { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubredditsDropDown from './subreddit/SubredditsDropDown';
import xCircle from '../assets/x_circle.svg';
import searchIcon from '../assets/search_icon.svg';

function SearchBar(): JSX.Element {
  const [text, setText] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  function toggleDropdown(): void {
    setDropdownVisible((prev) => !prev);
  }

  function navigateToSubreddit(e: SyntheticEvent): void {
    const target = e.target as HTMLAnchorElement;
    const chosenSubreddit = target.getAttribute('data') as string;
    navigate(`/r/${chosenSubreddit}`);
    toggleDropdown();
  }

  // called by x-circle
  function clearText(): void {
    setText('');
  }

  return (
    <div
      id="search-bar"
      className="main-input"
      onClick={toggleDropdown}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      <img src={searchIcon} alt="" className="icon" />
      <input
        type="text"
        placeholder="Search Reddit"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {/* only render x-circle when theres a text in input */}
      {text !== "" ? (
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
