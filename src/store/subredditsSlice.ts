import { createSlice } from '@reduxjs/toolkit';
import defaultCommunityIcon from '../defaultCommunityIcon';

const initialState = {};

export const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    addSubreddit: (state, action) => {
      const updatedSubreedits = action.payload;
      const stateToUpdate: SubredditsObject = {};
      updatedSubreedits.forEach((subreddit: ICommunity) => {
        if(subreddit.icon === undefined){
          subreddit.icon = defaultCommunityIcon;
        }
        // add subreddit name as key and subreddit itself as value to state
        stateToUpdate[subreddit.name] = subreddit;
      }
    );
    // update state
    return stateToUpdate;
    },
  },
});

export const { addSubreddit } = subredditsSlice.actions;

export const selectSubreddits = (state: { subreddits: SubredditsObject}): SubredditsObject => state.subreddits;

export default subredditsSlice.reducer;
