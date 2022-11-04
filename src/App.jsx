import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { addUser } from './store/userSlice';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import UploadIconModal from './components/UploadIconModal';
import CreateCommunityModal from './components/subreddit/CreateCommunityModal';
import { toggleLogInModal, selectLoginModalVisibility } from './store/loginModalSlice';
import { addSubreddit } from './store/subredditsSlice';
import { database, authorization } from './firebase/firebase';
import './styles/appStyle.scss';
import './styles/modals.scss';
import { toggleChangeIconModal, selectChangeIconModalVisibility } from './store/changeIconModalSlice';
import { toggleAddCommunityModal, selectAddCommunityModalVisibility } from './store/addCommunityModalSlice';

function App() {
  const [signUpVisible, setSignUpVisible] = useState(false);
  const logInVisible = useSelector(selectLoginModalVisibility);
  const changeIconVisible = useSelector(selectChangeIconModalVisibility);
  const addCommunityVisible = useSelector(selectAddCommunityModalVisibility);
  const dispatch = useDispatch();

  function toggleSignUp() {
    setSignUpVisible((prevVisibility) => !prevVisibility);
  }

  // If theres a user logged in, add it to redux store
  useEffect(() => {
    setTimeout(() => {
      if (authorization.isUserSignedIn()) {
        database
          .getUserByEmail(authorization.getUser().email)
          .then((fetchedUser) => {
            dispatch(addUser(fetchedUser));
          });
      }
    }, 500);
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
      console.log({data})
      dispatch(addSubreddit(data));
    }
    getNames();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Header
          signUpFunc={toggleSignUp}
          logInFunc={() => dispatch(toggleLogInModal())}
          opaque={
            signUpVisible ||
            logInVisible ||
            changeIconVisible ||
            addCommunityVisible
          }
        />
        <MainContainer
          opaque={
            signUpVisible ||
            logInVisible ||
            changeIconVisible ||
            addCommunityVisible
          }
        />
        {/* modals */}
        {signUpVisible ? <SignUpModal closeFunc={toggleSignUp} /> : null}
        {logInVisible ? <LogInModal closeFunc={() => dispatch(toggleLogInModal())} /> : null}
        {changeIconVisible ? (
          <UploadIconModal
            closeFunc={() => dispatch(toggleChangeIconModal())}
          />
        ) : null}
        {addCommunityVisible ? (
          <CreateCommunityModal
            closeFunc={() => dispatch(toggleAddCommunityModal())}
          />
        ) : null}
      </div>
    </BrowserRouter>
  );
}

export default App;
