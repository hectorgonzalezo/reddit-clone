import { createSlice } from '@reduxjs/toolkit';
import { database } from '../firebase/firebase';


const initialState = {};

export const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    addSubreddit: (state, action) => {
      const updatedSubreedits = action.payload;
      updatedSubreedits.forEach((subreddit) => state[subreddit.name] = subreddit);
    },
  },
});

export const { addSubreddit } = subredditsSlice.actions;

export const selectSubreddits = (state) => state.subreddits;

export default subredditsSlice.reducer;
