import React from 'react';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import SignUpModal from './components/SignUpModal';
import './styles/appStyle.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <MainContainer />
      <SignUpModal />
    </div>
  );
}

export default App;
