import React, { SyntheticEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import arrowDownIcon from '../assets/arrow_down_icon.svg';
import SubredditsDropDown from './subreddit/SubredditsDropDown';


interface CommunityChooserProps {
  onChoosing: (arg0: string) => void;
  header?: boolean;
  error?: boolean;
};

function CommunityChooser({
  onChoosing,
  header= false,
  error= false,
}: CommunityChooserProps): JSX.Element {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const subreddits = useSelector(selectSubreddits);

  const [chosenSubreddit, setChosenSubreddit] = useState<string | null>(null);

  function toggleDropdown(): void {
    setDropdownVisible((prev) => !prev);
  }

  // chooses subreddit from dropdown
  function chooseFromDropdown(e: SyntheticEvent): void {
    const target = e.target as HTMLAnchorElement;
    const subredditName = target.getAttribute("data-name") as string;
    setChosenSubreddit(subredditName);
    onChoosing(subredditName);
  }

  return (
    <div className="main-child" id="community-chooser">
      <button
        type="button"
        className={
          error ? "button-show-drop-down--error" : "button-show-drop-down"
        }
        onClick={toggleDropdown}
      >
        {chosenSubreddit !== null ? (
          <img
            className="user-icon"
            src={subreddits[chosenSubreddit].icon}
            alt=""
          />
        ) : (
          <div className="user-icon-hidden" />
        )}
        <h1 data-testid="community-chooser-title">
          {chosenSubreddit !== null
            ? subreddits[chosenSubreddit].name
            : "Choose a community"}
        </h1>
        <img src={arrowDownIcon} alt="" className="icon" />
      </button>
      <SubredditsDropDown
        dropdownVisible={dropdownVisible}
        toggleDropdown={toggleDropdown}
        chooseFromDropdown={chooseFromDropdown}
      />
    </div>
  );
}


export default CommunityChooser;
