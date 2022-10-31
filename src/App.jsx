import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from './store/userSlice';
import { BrowserRouter } from 'react-router-dom';
import { authorization } from './firebase/firebase';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import { toggleLogInModal, selectLoginModalVisibility } from './store/loginModalSlice';
import { addSubreddit } from './store/subredditsSlice';
import { database } from './firebase/firebase';
import './styles/appStyle.scss';
import './styles/modals.scss';

function App() {
  const [signUpVisible, setSignUpVisible] = useState(false);
  const logInVisible = useSelector(selectLoginModalVisibility);
  // const [logInVisible, setLogInVisible] = useState(false);
  const dispatch = useDispatch();

  function toggleSignUp() {
    setSignUpVisible((prevVisibility) => !prevVisibility);
  }

  function toggleLogIn() {
    // setLogInVisible((prevVisibility) => !prevVisibility);
    dispatch(toggleLogInModal());
  }

  // If theres a user logged in, add it to redux store
  useEffect(() => {
    if (authorization.getUser() !== null) {
      database
        .getUserByEmail(authorization.getUser().email)
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
          signUpFunc={toggleSignUp}
          logInFunc={toggleLogIn}
          opaque={signUpVisible || logInVisible}
        />
        <MainContainer opaque={signUpVisible || logInVisible} />
        {signUpVisible ? <SignUpModal closeFunc={toggleSignUp} /> : null}
        {logInVisible ? <LogInModal closeFunc={toggleLogIn} /> : null}
      </div>
    </BrowserRouter>
  );
}

export default App;
