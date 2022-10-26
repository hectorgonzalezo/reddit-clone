import React, { useEffect, useState } from 'react';
import CreatePostPreview from './CreatePostPreview';
import PopularPostsBar from './PopularPostsBar';
import TopCommunitiesBar from './TopCommunitiesBar';
import Button from './Button';
import PostsArea from './PostsArea';
import { bool } from 'prop-types';
import { database } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';
import '../styles/mainStyle.scss';

function MainContainer({ opaque }) {
  const user = useSelector(selectUser);
  const [subredditsData, setSubredditsData] = useState([]);
  console.log(user)

  useEffect(() => {
    async function getNames() {
      let data;
      try {
        data = await database.getSubredditsData();
      } catch {
        console.log("Couldn't get subreddit data");
        data = [];
      }
      setSubredditsData(data);
    }
    getNames();
  }, []);

  return (
    <main className={opaque ? 'opaque' : ''}>
      <div id="left-side">
        {user.username !== undefined ? <CreatePostPreview /> : null}
        <PopularPostsBar />
        <PostsArea subreddits={subredditsData} />
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

MainContainer.defaultProps = {
  opaque: false,
};

MainContainer.propTypes = {
  opaque: bool,
};

export default MainContainer;
