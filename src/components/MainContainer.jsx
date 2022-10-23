import React from 'react';
import PopularPostsBar from './PopularPostsBar';
import PostPreview from './PostPreview';
import TopCommunitiesBar from './TopCommunitiesBar';
import Button from './Button';
import '../styles/mainStyle.scss';

function MainContainer() {
  return (
    <main>
      <div id="left-side">
        <PopularPostsBar />
        <div id="posts">
          <PostPreview />
        </div>
      </div>
      <div id="right-side">
        <TopCommunitiesBar />
        <aside id="agreements">
          <div>
            <a href="https://www.redditinc.com/policies/user-agreement">User Agreement</a>
            <a href="https://www.reddit.com/policies/privacy-policy">Privacy Policy</a>
            <a href="https://www.redditinc.com/policies/content-policy">Content Policy</a>
            <a href="https://www.redditinc.com/policies/moderator-code-of-conduct">Moderator Code of Conduct</a>
          </div>
          <hr />
          <p>Reddit Inc &#169; 2022. All rights reserved</p>
        </aside>
        <Button text="Back to Top" />
      </div>
    </main>
  );
}

export default MainContainer;
