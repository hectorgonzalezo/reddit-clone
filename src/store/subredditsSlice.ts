import { createSlice } from '@reduxjs/toolkit';
import defaultCommunityIcon from '../defaultCommunityIcon';


const initialState = {};

export const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    addSubreddit: (state, action) => {
      const updatedSubreedits = action.payload;
      updatedSubreedits.forEach((subreddit: ICommunity) => {
        if(subreddit.icon === undefined){
          subreddit.icon = defaultCommunityIcon
        }
        return state[subreddit.name] = subreddit;

      }
);
    },
  },
});

export const { addSubreddit } = subredditsSlice.actions;

export const selectSubreddits = (state: SubredditsState): SubredditsObject => state.subreddits;

export default subredditsSlice.reducer;
