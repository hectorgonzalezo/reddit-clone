import { createSlice } from '@reduxjs/toolkit';
import { AddCommunityModalState } from '../type';

export const addCommunityModalSlice = createSlice({
  name: 'addCommunityModalVisible',
  initialState: false,
  reducers: {
    toggleAddCommunityModal: (state, action) => !state
  },
});

export const { toggleAddCommunityModal } = addCommunityModalSlice.actions;

export const selectAddCommunityModalVisibility = (state: AddCommunityModalState): boolean => state.addCommunityModalVisible;

export default addCommunityModalSlice.reducer;
