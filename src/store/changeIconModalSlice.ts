import { createSlice } from '@reduxjs/toolkit';

export const changeIconModalSlice = createSlice({
  name: 'changeIconModalVisible',
  initialState: false,
  reducers: {
    toggleChangeIconModal: (state) => !state
  },
});

export const { toggleChangeIconModal } = changeIconModalSlice.actions;

export const selectChangeIconModalVisibility = (state: ChangeIconModalState): boolean => state.changeIconModalVisible;

export default changeIconModalSlice.reducer;
