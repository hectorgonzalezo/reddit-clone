import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import subredditsReducer from './subredditsSlice';
import loginModalReducer from './loginModalSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    subreddits: subredditsReducer,
    loginModalVisible: loginModalReducer,
  }
});

export default store;
