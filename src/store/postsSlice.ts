import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IPost[] = [];

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<IPost[]>) => {
      const newPost = action.payload;
    return newPost;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      const newPosts = [...state, action.payload];
    return newPosts;
    },
  },
});

export const { addPosts, addPost } = postsSlice.actions;

export const selectPosts = (state: { posts: IPost[]}): IPost[] => state.posts;

export default postsSlice.reducer;