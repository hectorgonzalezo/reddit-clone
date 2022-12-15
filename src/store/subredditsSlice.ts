import { createSlice } from '@reduxjs/toolkit';
import { database } from '../firebase/firebase';
import { ICommunity, SubredditsState } from '../type';


const initialState = {};

export const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    addSubreddit: (state, action) => {
      const updatedSubreedits = action.payload;
      updatedSubreedits.forEach((subreddit: ICommunity) => state[subreddit.name] = subreddit);
    },
  },
});

export const { addSubreddit } = subredditsSlice.actions;

export const selectSubreddits = (state: SubredditsState): [] | ICommunity[] => state.subreddits;

export default subredditsSlice.reducer;
