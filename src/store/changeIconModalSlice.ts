import { createSlice } from '@reduxjs/toolkit';
import { ChangeIconModalState } from '../type';

export const changeIconModalSlice = createSlice({
  name: 'changeIconModalVisible',
  initialState: false,
  reducers: {
    toggleChangeIconModal: (state, action) => !state
  },
});

export const { toggleChangeIconModal } = changeIconModalSlice.actions;

export const selectChangeIconModalVisibility = (state: ChangeIconModalState): boolean => state.changeIconModalVisible;

export default changeIconModalSlice.reducer;
