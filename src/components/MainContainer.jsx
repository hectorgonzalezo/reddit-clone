import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { bool } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import PostCreator from './PostCreator';
import HomePage from './HomePage';

import '../styles/mainStyle.scss';

function MainContainer({ opaque }) {
  const subredditsData = useSelector(selectSubreddits);

  return (
    <main className={opaque ? "opaque" : ""}>
        <Routes>
          <Route path="/" element={<HomePage subredditsData={subredditsData} />} />
          <Route path="/create-post" element={<PostCreator />} />
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
