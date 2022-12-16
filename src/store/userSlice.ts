import { createSlice } from '@reduxjs/toolkit';
import defaultUserIcon from '../defaultUserIcon';

const initialState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.votes = action.payload.votes;
      state.subreddits = action.payload.subreddits;
      if(action.payload.icon !== undefined){
        state.icon = action.payload.icon;
      } else {
        state.icon = defaultUserIcon
      }
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
