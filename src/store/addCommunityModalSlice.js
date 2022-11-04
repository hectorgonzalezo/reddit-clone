import { createSlice } from '@reduxjs/toolkit';

export const addCommunityModalSlice = createSlice({
  name: 'addCommunityModalVisible',
  initialState: false,
  reducers: {
    toggleAddCommunityModal: (state, action) => {
      return !state
    }
  },
});

export const { toggleAddCommunityModal } = addCommunityModalSlice.actions;

export const selectAddCommunityModalVisibility = (state) => state.addCommunityModalVisible;

export default addCommunityModalSlice.reducer;
