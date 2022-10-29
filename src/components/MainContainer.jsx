import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { authorization } from '../firebase/firebase';
import { bool } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import PostCreator from './PostCreator';
import HomePage from './HomePage';

import '../styles/mainStyle.scss';

function MainContainer({ opaque }) {
  const subredditsData = useSelector(selectSubreddits);
  const homepage = <HomePage subredditsData={subredditsData} />;

  return (
    <main className={opaque ? "opaque" : ""}>
      <Routes>
        <Route
          path="/"
          element={homepage}
        />
        <Route
          path="/create-post"
          element={
            authorization.auth.currentUser !== null ? (
              <PostCreator />
            ) : <Navigate to="/" />
          }
        />
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
