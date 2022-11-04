import { createSlice } from '@reduxjs/toolkit';

export const currentSubredditSlice = createSlice({
  name: 'currentSubreddit',
  initialState: null,
  reducers: {
    changeCurrentSubreddit: (state, action) => {
      return action.payload
    }
  },
});

export const { changeCurrentSubreddit } = currentSubredditSlice.actions;

export const selectCurrentSubreddit = (state) => state.currentSubreddit;

export default currentSubredditSlice.reducer;
