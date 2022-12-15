import { createSlice } from '@reduxjs/toolkit';

export const loginModalSlice = createSlice({
  name: 'loginModalVisible',
  initialState: false,
  reducers: {
    toggleLogInModal: (state) => !state
  },
});

export const { toggleLogInModal } = loginModalSlice.actions;

export const selectLoginModalVisibility = (state: LoginModalState): boolean => state.loginModalVisible;

export default loginModalSlice.reducer;
