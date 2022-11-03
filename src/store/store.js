import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import subredditsReducer from './subredditsSlice';
import loginModalReducer from './loginModalSlice';
import currentSubredditReducer from './currentSubredditSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    subreddits: subredditsReducer,
    loginModalVisible: loginModalReducer,
    currentSubreddit: currentSubredditReducer,
  }
});

export default store;
