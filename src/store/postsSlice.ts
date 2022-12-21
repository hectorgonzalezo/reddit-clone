import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostsObject = {};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<IPost[]>) => {
      const stateToUpdate: PostsObject = {};
      action.payload.forEach((post: IPost) => {
        // add subreddit name as key and subreddit itself as value to state
        stateToUpdate[post._id] = post;
      }
    );
    // update state
    return stateToUpdate;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      const newPost = action.payload;
      const newPosts = {...state, [newPost._id]: newPost };
    return newPosts;
    },
  },
});

export const { addPosts, addPost } = postsSlice.actions;

export const selectPosts = (state: { posts: PostsObject}): PostsObject => state.posts;

export default postsSlice.reducer;