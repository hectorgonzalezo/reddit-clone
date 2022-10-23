import React from 'react';
import PopularPostsBar from './PopularPostsBar';
import PostPreview from './PostPreview';
import TopCommunitiesBar from './TopCommunitiesBar';
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
      <TopCommunitiesBar />
    </div>
    </main>
  )
}

export default MainContainer;
