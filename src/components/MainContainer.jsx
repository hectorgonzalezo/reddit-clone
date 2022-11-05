import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { bool } from 'prop-types';
import PostDisplay from './post/PostDisplay';
import PostCreator from './post/PostCreator';
import HomePage from './HomePage';
import SubredditDisplay from './subreddit/SubredditDisplay';
import AllSubreddits from './subreddit/AllSubreddits';
import UserDisplay from './UserDisplay';

import '../styles/mainStyle.scss';

function MainContainer({ opaque }) {
  const homepage = <HomePage />;

  return (
    <main className={opaque ? 'opaque' : ''}>
      <Routes>
        <Route
          path="/"
          element={homepage}
        />
        <Route
          path="/create-post/:initialType"
          element={<PostCreator />}
        />
        <Route path="r/:name" element={<SubredditDisplay />}/>
        <Route path="r/:name/:postId" element={<PostDisplay />} />
        <Route path="u/:name" element={<UserDisplay />} />
        <Route path="allSubreddits" element={<AllSubreddits />} />
      </Routes>
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
