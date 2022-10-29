import { createSlice } from '@reduxjs/toolkit';

export const loginModalSlice = createSlice({
  name: 'loginModalVisible',
  initialState: true,
  reducers: {
    toggleLoginModal: (state) => !state,
  },
});

export const { toggleLoginModal } = loginModalSlice.actions;

export const selectLoginModalVisibility = (state) => state.loginModalVisible;

export default loginModalSlice.reducer;
