import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../../store/subredditsSlice';
import { selectUser } from '../../store/userSlice';
import DropDown from '../DropDown';

interface SubredditsDropDownProps {
  dropdownVisible: boolean;
  toggleDropdown: () => void;
  chooseFromDropdown: (arg0: SyntheticEvent) => void;
  header?: boolean;
  search?: boolean;
  filterBy?: string;
};

function SubredditsDropDown({
  dropdownVisible,
  toggleDropdown,
  chooseFromDropdown,
  header = false,
  search = false,
  filterBy = '',
}: SubredditsDropDownProps): JSX.Element {
  const subreddits = useSelector(selectSubreddits);
  const user = useSelector(selectUser);
  const userCommunities = user.communities as string[];
  const [chosenSubreeddits, setChosenSubreddits] = useState(
    Object.values(subreddits)
  );

  useEffect(() => {
    // filer subreddits when searching on search bar
    if (filterBy !== "") {
      const filtered = Object.values(subreddits).filter((subreddit) =>
        subreddit.name.includes(filterBy)
      );
      setChosenSubreddits(filtered);
    } else {
      setChosenSubreddits(Object.values(subreddits));
    }
  }, [subreddits, filterBy]);

  return (
    <DropDown
      visible={dropdownVisible}
      closeFunc={toggleDropdown}
      testid="subreddits-dropdown"
    >
      {!search ? <h1>Your communities</h1> : null}
      {userCommunities !== undefined
        ? Object.values(subreddits).map((subreddit: ICommunity) => {
            if (userCommunities.includes(subreddit._id)) {
              return (
                <React.Fragment key={`${subreddit.name}-fragment`}>
                  <hr key={`${subreddit.name}-line`} />
                  <a
                    key={`${subreddit.name}-link`}
                    onClick={chooseFromDropdown}
                    data-name={subreddit.name}
                  >
                    <img
                      key={`${subreddit.name}-icon`}
                      src={subreddit.icon}
                      alt=""
                      data-name={subreddit.name}
                      className="user-icon"
                    />
                    <p
                      key={`${subreddit.name}-name`}
                      data-name={subreddit.name}
                    >
                      {subreddit.name}
                    </p>
                  </a>
                </React.Fragment>
              );
            }
          })
        : null}
      {!search ? <hr /> : null}
      {header ? (
        <>
          {!search ? <h1>All communities</h1> : null}
          {chosenSubreeddits.map((subreddit) => (
            <React.Fragment key={`${subreddit.name}-fragment`}>
              <hr key={`${subreddit.name}-line`} />
              <a
                key={`${subreddit.name}-link`}
                onClick={chooseFromDropdown}
                data-name={subreddit.name}
              >
                <img
                  key={`${subreddit.name}-icon`}
                  src={subreddit.icon}
                  alt=""
                  data-name={subreddit.name}
                  className="user-icon"
                />
                <p key={`${subreddit.name}-name`} data-name={subreddit.name}>
                  {subreddit.name}
                </p>
              </a>
            </React.Fragment>
          ))}
        </>
      ) : null}
    </DropDown>
  );
}

export default SubredditsDropDown;

