import { createSlice } from '@reduxjs/toolkit';
import defaultUserIcon from '../defaultUserIcon';

const initialState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { user } = action.payload;

      if(user.icon === undefined){
        user.icon = defaultUserIcon;
      }

      user.token = action.payload.token;

      return user;
      
      localStorage.setItem("whoAmI", JSON.stringify(action.payload));
    },
    removeUser: (state) => {
      localStorage.removeItem("whoAmI");
      return undefined;
    },
  }
});

export const { addUser, removeUser } = userSlice.actions;

export const selectUser = (state: { user: UserState }): IUser => state.user;

export default userSlice.reducer;
