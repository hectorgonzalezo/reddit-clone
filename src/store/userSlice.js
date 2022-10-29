import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: undefined,
  email: undefined,
  icon: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.icon = action.payload.icon;
      state.votes = action.payload.votes;
    },
    updateIcon: (state, action) => {
      state.icon = action.payload;
    },
    removeUser: (state, action) => {
      state.username = undefined;
      state.email = undefined;
      state.icon = undefined;
    },
  }
});

export const { addUser, updateIcon, removeUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
