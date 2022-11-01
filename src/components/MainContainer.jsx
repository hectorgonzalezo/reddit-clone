import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { bool } from 'prop-types';
import { authorization } from '../firebase/firebase';
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
          path="/create-post"
          element={
            authorization.isUserSignedIn() ? (
              <PostCreator />
            ) : <Navigate to="/" />
          }
        />
        <Route path="r/:name" element={<SubredditDisplay />} />
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
