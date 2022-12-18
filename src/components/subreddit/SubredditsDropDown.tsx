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
      {user.communities !== undefined
        ? user.communities.map((subreddit) => {
            if (subreddits[subreddit] !== undefined) {
              return (
                <React.Fragment key={`${subreddits[subreddit].name}-fragment`}>
                  <hr key={`${subreddits[subreddit].name}-line`} />
                  <a
                    key={`${subreddits[subreddit].name}-link`}
                    onClick={chooseFromDropdown}
                    data-id={subreddits[subreddit]._id}
                  >
                    <img
                      key={`${subreddits[subreddit].name}-icon`}
                      src={subreddits[subreddit].icon}
                      alt=""
                      data-id={subreddits[subreddit]._id}
                      className="user-icon"
                    />
                    <p
                      key={`${subreddits[subreddit].name}-name`}
                      data-id={subreddits[subreddit]._id}
                    >
                      {subreddits[subreddit].name}
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
                data-id={subreddit._id}
              >
                <img
                  key={`${subreddit.name}-icon`}
                  src={subreddit.icon}
                  alt=""
                  data-id={subreddit._id}
                  className="user-icon"
                />
                <p key={`${subreddit._id}-id`} data-id={subreddit._id}>
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

