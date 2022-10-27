import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { bool } from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSubreddits } from '../store/subredditsSlice';
import HomePage from './HomePage';

import '../styles/mainStyle.scss';

function MainContainer({ opaque }) {
  const subredditsData = useSelector(selectSubreddits);

  return (
    <main className={opaque ? 'opaque' : ''}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element= { <HomePage subredditsData={subredditsData} /> } />
      </Routes>
    </BrowserRouter>
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
