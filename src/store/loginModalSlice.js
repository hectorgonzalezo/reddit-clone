import { createSlice } from '@reduxjs/toolkit';

export const loginModalSlice = createSlice({
  name: 'loginModalVisible',
  initialState: false,
  reducers: {
    toggleLogInModal: (state, action) => {
      return !state
    }
  },
});

export const { toggleLogInModal } = loginModalSlice.actions;

export const selectLoginModalVisibility = (state) => state.loginModalVisible;

export default loginModalSlice.reducer;
