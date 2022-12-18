import { createSlice } from '@reduxjs/toolkit';
import defaultUserIcon from '../defaultUserIcon';

const initialState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.username = action.payload.user.username;
      state.email = action.payload.user.email;
      state.votes = action.payload.user.votes;
      state.subreddits = action.payload.user.subreddits;
      state.token = action.payload.token;
      if(action.payload.icon !== undefined){
        state.icon = action.payload.user.icon;
      } else {
        state.icon = defaultUserIcon
      }
      
      localStorage.setItem("whoAmI", JSON.stringify(action.payload));
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
      state.token = undefined;

      localStorage.removeItem("whoAmI");
    },
  }
});

export const { addUser, updateIcon, removeUser } = userSlice.actions;

export const selectUser = (state: UserState): IUser => state.user;

export default userSlice.reducer;
