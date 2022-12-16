import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.icon = action.payload.icon;
      state.votes = action.payload.votes;
      state.subreddits = action.payload.subreddits;
    },
    updateIcon: (state, action) => {
      state.icon = action.payload;
    },
    removeUser: (state) => {
      state.username = undefined;
      state.email = undefined;
      state.icon = undefined;
      state.votes = undefined;
      state.subreddits = undefined;
    },
  }
});

export const { addUser, updateIcon, removeUser } = userSlice.actions;

export const selectUser = (state: UserState): IUser => state.user;

export default userSlice.reducer;
