import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import subredditsReducer from './subredditsSlice';
import loginModalReducer from './loginModalSlice';
import changeIconModalReducer from './changeIconModalSlice';
import addCommunityModalReducer from './addCommunityModalSlice';
import currentSubredditReducer from './currentSubredditSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    subreddits: subredditsReducer,
    loginModalVisible: loginModalReducer,
    changeIconModalVisible: changeIconModalReducer,
    addCommunityModalVisible: addCommunityModalReducer,
    currentSubreddit: currentSubredditReducer,
  }
});

export default store;
