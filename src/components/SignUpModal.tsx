import React, { useState, useRef, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { signUp } from '../api/users';
import Button from './Button';
import { addUser } from '../store/userSlice';
import loadingIcon from '../assets/loading.gif';

interface SignUpModalProps {
  closeFunc?: () => void;
};

function SignUpModal({ closeFunc= () => {} }: SignUpModalProps): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const password1Ref = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);
  const [disableButton, setDisableButton] = useState(true);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();

  // This function gets called on every input value change
  // If the whole form is valid, it activates the continue button
  function validate(e: SyntheticEvent): void {
    const target = e.target as HTMLInputElement;
    const form = formRef.current as HTMLFormElement;
    // Check input validity
    const elementValidity = target.validity;
    if (target.parentNode?.firstChild) {
      // error display element
      const display = target.parentNode.firstChild as HTMLSpanElement;
    // Check type of validity
    switch (true) {
      case elementValidity.typeMismatch:
        target.setCustomValidity('Please write a valid email');
        display.innerText = 'Please write a valid email';
        break;
      case elementValidity.patternMismatch:
        if (target === userNameRef.current) {
          target.setCustomValidity('Only letters allowed in username');
          display.innerText = 'Only letters allowed in username';
        } else {
          target.setCustomValidity('Please write a valid email');
          display.innerText = 'Please write a valid email';
        }
        break;
      case elementValidity.tooShort:
        target.setCustomValidity('Password must be at least 6 characters long');
        display.innerText = 'Password must be at least 6 characters long';
        break;
      default:
        target.setCustomValidity('');
        display.innerText = '';
    }
  }


    // if element is password, check that both passwords equal each other
    if (
      (target === password2Ref.current || target === password1Ref.current) &&
      password1Ref?.current !== null &&
      password2Ref?.current?.parentNode
    ) {
      const display = password2Ref.current.parentNode.firstChild as HTMLSpanElement;
      if (
        // writing second password and first one is not the same
        (target === password2Ref.current &&
          password2Ref.current.value !== password1Ref.current.value) ||
        // writing first password and second one is not empty
        (target === password1Ref.current &&
          password2Ref.current.value !== "" &&
          password2Ref.current.value !== password1Ref.current.value)
      ) {
        password2Ref.current.setCustomValidity("Passwords don't match");
        display.innerText =
          "Passwords don't match";
      } else {
        password2Ref.current.setCustomValidity("");
        display.innerText = "";
      }
    }

    // if form is valid, activate submit button
    setDisableButton(!form.checkValidity());
  }

  // Shows error message on modal if username or email already exists
  function displayErrorMessage(data: { errors: BackendErrors }): void {
    switch (data.errors[0].msg) {
      case 'Username already exists':
        setUsernameAlreadyExists(true);
        break;
      case 'Email already exists':
        setEmailAlreadyExists(true);
        break;
      default:
        break;
    }
    // hide loading animaiton
    setLoadingData(false);
  }

  function submitSignUp(e: SyntheticEvent): void {
    e.preventDefault();
    if (
      userNameRef?.current !== null &&
      emailRef.current !== null &&
      password1Ref.current !== null &&
      password2Ref.current !== null
    ) {
      const username = userNameRef.current.value;
      const email = emailRef.current.value;
      const password = password1Ref.current.value;
      const passwordConfirm = password2Ref.current.value;
      // add loading animation
      setLoadingData(true);

      // Sign up user
      signUp({ username, email, password, passwordConfirm })
        .then((data) => {
          setEmailAlreadyExists(false);
          setUsernameAlreadyExists(false);
          // if theres an error, display the message on modal
          if(data.hasOwnProperty('errors')){
            displayErrorMessage(data as { errors: BackendErrors });
          } else {
            // update redux store
            dispatch(addUser(data));
          closeFunc();
          }
        })
        .catch((err) =>{
        console.log(err);
        // If email already exists
        setLoadingData(false);
        });
    }
  }

  return (
    <div id="signUp-outer" className="modal-outer">
      <div id="signUp-inner" className="modal-inner">
        <div>
          <button
            type="button"
            className="close-button"
            onClick={closeFunc}
            aria-label="close button"
          >
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
        </div>

        <div className="division" />
        <form action="" ref={formRef}>
          <div className="input-wrap">
            <span />
            {usernameAlreadyExists ? <span>Username is already registered</span> : null}
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
            {emailAlreadyExists ? <span>Email is already registered</span> : null}
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
          <Button
            text=""
            type="submit"
            disabled={disableButton}
            onClick={submitSignUp}
          >
            {loadingData ? (
              <img
                src={loadingIcon}
                alt="loading"
                data-testid="loading-icon"
                className="loading-icon"
              />
            ) : (
              ["Sign Up"]
            )}
          </Button>
        </form>
        <p>
          Already a redditor? <a href="">Sign In</a>
        </p>
      </div>
    </div>
  );
}



export default SignUpModal;
