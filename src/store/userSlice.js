import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: undefined,
  email: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    add: (state) => {
      state.username = 'juan';
    },
    remove: (state) => {
     state.username = undefined;
    }
  }
});

export const { add, remove } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
