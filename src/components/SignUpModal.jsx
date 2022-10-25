import React from 'react';
import Button from './Button';
import googleIcon from '../assets/google.png';
import '../styles/signUpModal.scss';
import { authorization } from '../firebase/firebase';

function SignUpModal() {
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
        <form action="">
          <div className="input-wrap">
            <input type="text" placeholder="0" name="username" id="username" required />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-wrap">
            <input type="email" placeholder="0" name="email" id="email" required />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-wrap">
            <input
              type="password"
              placeholder="0"
              name="password"
              id="password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-wrap">
            <input
              type="password"
              placeholder="0"
              name="repeatPassword"
              id="repeatPassword"
              required
            />
            <label htmlFor="repeatPassword">Repeat Password</label>
          </div>
          <Button text="continue" />
        </form>
        <p>
          Already a redditor? <a href="">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpModal;
