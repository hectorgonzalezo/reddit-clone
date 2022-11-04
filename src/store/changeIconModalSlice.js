import { createSlice } from '@reduxjs/toolkit';

export const changeIconModalSlice = createSlice({
  name: 'changeIconModalVisible',
  initialState: false,
  reducers: {
    toggleChangeIconModal: (state, action) => {
      return !state
    }
  },
});

export const { toggleChangeIconModal } = changeIconModalSlice.actions;

export const selectChangeIconModalVisibility = (state) => state.changeIconModalVisible;

export default changeIconModalSlice.reducer;
