import { createSlice } from '@reduxjs/toolkit';

export const addCommunityModalSlice = createSlice({
  name: 'addCommunityModalVisible',
  initialState: false,
  reducers: {
    toggleAddCommunityModal: (state) => !state
  },
});

export const { toggleAddCommunityModal } = addCommunityModalSlice.actions;

export const selectAddCommunityModalVisibility = (state: AddCommunityModalState): boolean => state.addCommunityModalVisible;

export default addCommunityModalSlice.reducer;
