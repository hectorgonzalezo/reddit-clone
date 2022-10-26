import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: undefined,
  email: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.username;
    },
    removeUser: (state, action) => {
      state.username = undefined;
      state.email = undefined;
    },
  }
});

export const { addUser, removeUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
