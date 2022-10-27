import React, { useState, useEffect } from 'react';
import CreatePostPreview from './CreatePostPreview';
import PopularPostsBar from './PopularPostsBar';
import TopCommunitiesBar from './TopCommunitiesBar';
import Button from './Button';
import PostsArea from './PostsArea';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import { arrayOf, objectOf, string } from 'prop-types';

function HomePage({ subredditsData }) {
  const user = useSelector(selectUser);
  const [chosenSubreddits, setChosenSubreddits] = useState([]);

  // update subreddits for posts area every time they change
  useEffect(() => {
    setChosenSubreddits(Object.values(subredditsData));
  }, [subredditsData])

  return (
    <>
      <div id="left-side">
        {user.username !== undefined ? <CreatePostPreview /> : null}
        <PopularPostsBar />
        <PostsArea subreddits={chosenSubreddits} />
      </div>
      <div id="right-side">
        <TopCommunitiesBar />
        <aside id="agreements">
          <div>
            <a href="https://www.redditinc.com/policies/user-agreement">
              User Agreement
            </a>
            <a href="https://www.reddit.com/policies/privacy-policy">
              Privacy Policy
            </a>
            <a href="https://www.redditinc.com/policies/content-policy">
              Content Policy
            </a>
            <a href="https://www.redditinc.com/policies/moderator-code-of-conduct">
              Moderator Code of Conduct
            </a>
          </div>
          <hr />
          <p>Reddit Inc &#169; 2022. All rights reserved</p>
        </aside>
        <Button text="Back to Top" />
      </div>
    </>
  );
}

HomePage.defaultProps = {
  subredditsData: [],
};

HomePage.propTypes = {
  subredditsData: objectOf(objectOf(string)),
};

export default HomePage;
