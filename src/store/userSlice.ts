import { createSlice } from '@reduxjs/toolkit';
import defaultUserIcon from '../defaultUserIcon';

const initialState: UserInState = {} as UserInState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { user } = action.payload;

      if(user.icon === undefined) {
        user.icon = defaultUserIcon;
      }

      user.token = action.payload.token;

      localStorage.setItem("whoAmI", JSON.stringify(action.payload));

      return user;
    },
    removeUser: (state) => {
      localStorage.removeItem("whoAmI");
      return {} as UserInState;
    },
  }
});

export const { addUser, removeUser } = userSlice.actions;

export const selectUser = (state: UserState): IUser => state.user;

export default userSlice.reducer;
