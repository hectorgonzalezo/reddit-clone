import React, { useState, useRef } from 'react';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';
import googleIcon from '../assets/google.png';
import loadingIcon from '../assets/loading.gif';
import { func } from 'prop-types';
import { authorization } from '../firebase/firebase';

function SignUpModal({ closeFunc }) {
  const formRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const password1Ref = useRef();
  const password2Ref = useRef();
  const [disableButton, setDisableButton] = useState(true);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();

  // This function gets called on every input value change
  // If the whole form is valid, it activates the continue button
  function validate(e) {
    // Check input validity
    const elementValidity = e.target.validity;
    // Checkt type of validity
    switch (true) {
      case elementValidity.typeMismatch:
        e.target.setCustomValidity('Please write a valid email');
        e.target.parentNode.firstChild.innerText = 'Please write a valid email';
        break;
      case elementValidity.patternMismatch:
        if (e.target === userNameRef.current) {
          e.target.setCustomValidity('Only letters allowed in username');
          e.target.parentNode.firstChild.innerText = 'Only letters allowed in username';
        } else {
          e.target.setCustomValidity('Please write a valid email');
          e.target.parentNode.firstChild.innerText = 'Please write a valid email';
        }
        break;
      case elementValidity.tooShort:
        e.target.setCustomValidity('Password must be at least 6 characters long');
        e.target.parentNode.firstChild.innerText = 'Password must be at least 6 characters long';
        break;
      default:
        e.target.setCustomValidity('');
        e.target.parentNode.firstChild.innerText = '';
    }


    // if element is password, check that both passwords equal each other
    if ((e.target === password2Ref.current || e.target === password1Ref.current)) {
      if (
        // writing second password and first one is not the same
        (e.target === password2Ref.current
        && password2Ref.current.value !== password1Ref.current.value)
        // writing first password and second one is not empty
        || (e.target === password1Ref.current
          && password2Ref.current.value !== ''
          && password2Ref.current.value !== password1Ref.current.value)
      ) {
        password2Ref.current.setCustomValidity("Passwords don't match");
        password2Ref.current.parentNode.firstChild.innerText = "Passwords don't match";
      } else {
        password2Ref.current.setCustomValidity('');
        password2Ref.current.parentNode.firstChild.innerText = '';
      }
    }

    // if form is valid, activate submit button
    setDisableButton(!formRef.current.checkValidity());
  }

  async function submitSignUp(e) {
    e.preventDefault();
    const username = userNameRef.current.value;
    const email = emailRef.current.value;
    const password = password1Ref.current.value;
    const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
    try {
      // add loading animation
      setLoadingData(true);
      const account = await authorization.createAccount(email, password, username);
      setEmailAlreadyExists(false);
      // update redux store
      dispatch(addUser({ username, email, icon }));
      closeFunc();
    } catch (error) {
      // If email already exists
      setEmailAlreadyExists(true);
      setLoadingData(false);
    }
  }

  return (
    <div id="signUp-outer" className='modal-outer'>
      <div id="signUp-inner" className='modal-inner'>
        <div>
          <button type="button" className="close-button" onClick={closeFunc}>
            x
          </button>
          <h1>Sign Up</h1>
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
          <button type="button" onClick={authorization.logInPopup} className="google-button">
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
              onChange={validate}
              pattern="[A-Za-z0-9]*"
              maxLength={25}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-wrap">
            <span />
            <input
              type="email"
              placeholder="0"
              name="email"
              ref={emailRef}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              id="email"
              onChange={validate}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-wrap">
            <span />
            <input
              type="password"
              placeholder="0"
              name="password"
              id="password"
              ref={password1Ref}
              onChange={validate}
              minLength={6}
              autoComplete="on"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-wrap">
            <span />
            <input
              type="password"
              placeholder="0"
              name="repeatPassword"
              id="repeatPassword"
              ref={password2Ref}
              onChange={validate}
              minLength={6}
              autoComplete="on"
              required
            />
            <label htmlFor="repeatPassword">Repeat Password</label>
          </div>
          {emailAlreadyExists ? <span>Email is already registered</span> : null}
          <Button text="" type="submit" disabled={disableButton} onClick={submitSignUp} >
            {loadingData ? <img src={loadingIcon} alt="loading" data-testid="loading-icon" /> : ['Sign Up']}
          </Button>
        </form>
        <p>
          Already a redditor? <a href="">Sign In</a>
        </p>
      </div>
    </div>
  );
}

SignUpModal.defaultProps = {
  closeFunc: () => {},
};

SignUpModal.propTypes = {
  closeFunc: func,
};

export default SignUpModal;
