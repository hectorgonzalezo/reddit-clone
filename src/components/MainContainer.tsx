import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostDisplay from './post/PostDisplay';
import PostCreator from './post/PostCreator';
import HomePage from './HomePage';
import SubredditDisplay from './subreddit/SubredditDisplay';
import AllSubreddits from './subreddit/AllSubreddits';
import UserDisplay from './UserDisplay';

import '../styles/mainStyle.scss';

interface MainContainerProps {
  opaque: boolean;
};

function MainContainer({ opaque= false }: MainContainerProps): JSX.Element {
  return (
    <main className={opaque ? 'opaque' : ''}>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/create-post/:initialType"
          element={<PostCreator />}
        />
        <Route path="r/:name" element={<SubredditDisplay />}/>
        <Route path="r/:name/:postId" element={<PostDisplay />} />
        <Route path="u/:userId" element={<UserDisplay />} />
        <Route path="allSubreddits" element={<AllSubreddits />} />
      </Routes>
    </main>
  );
}



export default MainContainer;
