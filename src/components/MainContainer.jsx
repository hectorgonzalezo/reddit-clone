import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { bool } from 'prop-types';
import { authorization } from '../firebase/firebase';
import PostDisplay from './post/PostDisplay';
import PostCreator from './post/PostCreator';
import HomePage from './HomePage';
import SubredditDisplay from './subreddit/SubredditDisplay';

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
