import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import googleIcon from '../assets/google.png';
import loadingIcon from '../assets/loading.gif';
import { func } from 'prop-types';
import { authorization } from '../firebase/firebase';

function LogInModal({ closeFunc }) {
  const formRef = useRef();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const [usernameDoesntExist, setUsernameDoesntExist] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  async function submitLogIn(e) {
    e.preventDefault();
    const username = userNameRef.current.value;
    const password = passwordRef.current.value;
    try {
      // add loading animation to button
      setLoadingData(true);
      const account = await authorization.logIn(username, password);
      setUsernameDoesntExist(false);
      closeFunc();
    } catch (error) {
      setLoadingData(false);
      // If email already exists
      setUsernameDoesntExist(true);
    }
  }

  useEffect(() => {
    // add red outline to input fields if combination is invalid
    if (usernameDoesntExist) {
      userNameRef.current.classList.add('invalid');
      passwordRef.current.classList.add('invalid');
    } else {
      userNameRef.current.classList.remove('invalid');
      passwordRef.current.classList.remove('invalid');
    }
  }, [usernameDoesntExist]);

  return (
    <div id="logIn-outer">
      <div id="logIn-inner">
        <div>
          <button type="button" className="close-button" onClick={closeFunc}>
            x
          </button>
          <h1>Log In</h1>
          <p>
            By continuing, you are setting up a Reddit account and agree to our{" "}
            <a href="https://www.redditinc.com/policies/user-agreement">
              User Agreement
            </a>{" "}
            and{" "}
            <a href="https://www.reddit.com/policies/privacy-policy">
              Privacy Policy
            </a>
            .
          </p>
          <button onClick={authorization.logInPopup} className="google-button">
            <img src={googleIcon} alt="" />
            Continue with Google
          </button>
        </div>

        <div className="division">
          <hr />
          <h3>or</h3>
          <hr />
        </div>
        <form action="" ref={formRef}>
          <div className="input-wrap">
            <span />
            <input
              type="text"
              placeholder="0"
              name="username"
              id="username"
              ref={userNameRef}
              pattern="[A-Za-z0-9]*"
              maxLength={25}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-wrap">
            <span />
            <input
              type="password"
              placeholder="0"
              name="password"
              id="password"
              ref={passwordRef}
              minLength={6}
              autoComplete="on"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          {usernameDoesntExist ? <span>Incorrect username or password</span> : null}
          <Button text="" type="submit" onClick={submitLogIn} >
          {loadingData ? <img src={loadingIcon} alt="loading" data-testid="loading-icon" /> : ['Log In']}
          </Button>
        </form>
        <p>
          First time in reddit? <a href="">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

LogInModal.defaultProps = {
  closeFunc: () => {},
};

LogInModal.propTypes = {
  closeFunc: func,
};

export default LogInModal;
