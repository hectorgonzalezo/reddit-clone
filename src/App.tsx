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
import { getSubreddits } from './api/communities';
import './styles/appStyle.scss';
import './styles/modals.scss';
import { toggleChangeIconModal, selectChangeIconModalVisibility } from './store/changeIconModalSlice';
import { toggleAddCommunityModal, selectAddCommunityModalVisibility } from './store/addCommunityModalSlice';

function App(): JSX.Element {
  const [signUpVisible, setSignUpVisible] = useState(false);
  const logInVisible = useSelector(selectLoginModalVisibility);
  const changeIconVisible = useSelector(selectChangeIconModalVisibility);
  const addCommunityVisible = useSelector(selectAddCommunityModalVisibility);
  const dispatch = useDispatch();

  function toggleSignUp(): void {
    setSignUpVisible((prevVisibility) => !prevVisibility);
  }


  // look if theres a user stored in local storage
  // this keeps the user logged in even after closing the broswer
  useEffect(() => {
    const previousUser = localStorage.getItem('whoAmI');
    if (previousUser !== null) {
      const parsedUser = JSON.parse(previousUser);
      dispatch(addUser(parsedUser));
    }
  },[]);

  // Populate subreddits redux store
  useEffect(() => {
    async function getNames(): Promise<void> {
      let communities: ICommunity[];
      try {
        const response = await getSubreddits();
        communities = response.communities;
      } catch {
        console.log("Couldn't get subreddit data");
        communities = [];
      }
      dispatch(addSubreddit(communities));
    }
    getNames().catch((error) => console.log(error));
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
