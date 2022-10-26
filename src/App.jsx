import React, { useState } from 'react';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import SignUpModal from './components/SignUpModal';
import './styles/appStyle.scss';

function App() {
  const [signUpVisible, setSignUpVisible] = useState(true);

  function toggleSignUpModal() {
    setSignUpVisible(prevVisibility => !prevVisibility);
  }

  return (
    <div className="App">
      <Header signUpFunc={toggleSignUpModal} opaque={signUpVisible} />
      <MainContainer opaque={signUpVisible} />
      {signUpVisible ? <SignUpModal closeFunc={toggleSignUpModal} /> : null}
    </div>
  );
}

export default App;
