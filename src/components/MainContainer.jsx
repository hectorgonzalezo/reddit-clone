import React from 'react';
import PopularPostsBar from './PopularPostsBar';
import PostPreview from './PostPreview';
import '../styles/mainStyle.scss';

function MainContainer() {
  return(
    <main>
    <div id="left-side">
      <PopularPostsBar />
      <div id="posts">
        <PostPreview />
      </div>
    </div>
    <div id="right-side">

    </div>
    </main>
  )
}

export default MainContainer;
