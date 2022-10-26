import React, { useState } from 'react';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import store from './store/store';
import { Provider } from 'react-redux';
import './styles/appStyle.scss';

function App() {
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [logInVisible, setLogInVisible] = useState(false);

  function toggleSignUpModal() {
    setSignUpVisible((prevVisibility) => !prevVisibility);
  }

  function toggleLogInModal() {
    setLogInVisible((prevVisibility) => !prevVisibility);
  }

  return (
    <Provider store={store}>
      <div className="App">
        <Header
          signUpFunc={toggleSignUpModal}
          logInFunc={toggleLogInModal}
          opaque={signUpVisible || logInVisible}
        />
        <MainContainer opaque={signUpVisible || logInVisible} />
        {signUpVisible ? (
          <SignUpModal closeFunc={toggleSignUpModal} />
        ) : null}
        {logInVisible ? (
          <LogInModal closeFunc={toggleLogInModal} />
        ) : null}
      </div>
    </Provider>
  );
}

export default App;
