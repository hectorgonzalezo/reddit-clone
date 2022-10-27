import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import subredditsReducer from './subredditsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    subreddits: subredditsReducer,
  }
});

export default store;
