import React, { useState, useRef } from 'react';
import Button from './Button';
import googleIcon from '../assets/google.png';
import '../styles/signUpModal.scss';
import { authorization } from '../firebase/firebase';

function SignUpModal() {
  const formRef = useRef();
  const password1Ref = useRef();
  const password2Ref = useRef();
  const [disableButton, setDisableButton] = useState(true);

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
        e.target.setCustomValidity('Only letters allowed in username');
        e.target.parentNode.firstChild.innerText = 'Only letters allowed in username';
        break;
      case elementValidity.tooShort:
        e.target.setCustomValidity('Password must be at least 6 characters long');
        e.target.parentNode.firstChild.innerText = 'Password must be at least 6 characters long';
        break;
      default:
        e.target.setCustomValidity('');
        e.target.parentNode.firstChild.innerText = '';
    }

    // console.log(elementValidity);

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

  function submitSignUp(e) {
    e.preventDefault();
    console.log('signup')
  }

  return (
    <div id="signUp-outer">
      <div id="signUp-inner">
        <div>
          <button type="button" className="close-button">
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
              required
            />
            <label htmlFor="repeatPassword">Repeat Password</label>
          </div>
          <Button text="Sign Up" type="submit" disabled={disableButton} onClick={submitSignUp} />
        </form>
        <p>
          Already a redditor? <a href="">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpModal;
