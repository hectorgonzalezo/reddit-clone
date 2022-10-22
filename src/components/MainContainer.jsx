import React from 'react';
import PopularPostsBar from './PopularPostsBar';
import '../styles/mainStyle.scss';

function MainContainer() {
  return(
    <main>
    <div id="left-side">
      <PopularPostsBar />
    </div>
    <div id="right-side">

    </div>
    </main>
  )
}

export default MainContainer;
