import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import subredditsReducer from './subredditsSlice';
import loginModalReducer from './loginModalSlice';
import changeIconModalReducer from './changeIconModalSlice';
import addCommunityModalReducer from './addCommunityModalSlice';
import currentSubredditReducer from './currentSubredditSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    subreddits: subredditsReducer,
    loginModalVisible: loginModalReducer,
    changeIconModalVisible: changeIconModalReducer,
    addCommunityModalVisible: addCommunityModalReducer,
    currentSubreddit: currentSubredditReducer,
  }
});

export default store;
