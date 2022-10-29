import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from './store/userSlice';
import { BrowserRouter } from 'react-router-dom';
import { authorization } from './firebase/firebase';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import { addSubreddit } from './store/subredditsSlice';
import { database } from './firebase/firebase';
import './styles/appStyle.scss';
import './styles/modals.scss';

function App() {
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [logInVisible, setLogInVisible] = useState(false);
  const dispatch = useDispatch();

  function toggleSignUpModal() {
    setSignUpVisible((prevVisibility) => !prevVisibility);
  }

  function toggleLogInModal() {
    setLogInVisible((prevVisibility) => !prevVisibility);
  }

  // If theres a user logged in, add it to redux store
  useEffect(() => {
    if (authorization.getUser() !== null) {
      database
        .getUserByEmail(authorizedUser.email)
        .then((fetchedUser) => {
          const { username, email, icon, votes } = fetchedUser;
          dispatch(addUser({ username, email, icon, votes }));
        });
    }
  }, []);

  // Populate subreddits redux store
  useEffect(() => {
    async function getNames() {
      let data;
      try {
        data = await database.getSubredditsData();
      } catch {
        console.log("Couldn't get subreddit data");
        data = [];
      }
      dispatch(addSubreddit(data));
    }
    getNames();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Header
          signUpFunc={toggleSignUpModal}
          logInFunc={toggleLogInModal}
          opaque={signUpVisible || logInVisible}
        />
        <MainContainer opaque={signUpVisible || logInVisible} />
        {signUpVisible ? <SignUpModal closeFunc={toggleSignUpModal} /> : null}
        {logInVisible ? <LogInModal closeFunc={toggleLogInModal} /> : null}
      </div>
    </BrowserRouter>
  );
}

export default App;
