import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { logIn } from '../api/users';
import { addUser } from '../store/userSlice';
import Button from './Button';
import loadingIcon from '../assets/loading.gif';

interface LogInModalProps {
  closeFunc: () => void;
};

function LogInModal({ closeFunc= () => {} }: LogInModalProps): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [usernameDoesntExist, setUsernameDoesntExist] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();

  async function submitLogIn(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    if (userNameRef.current !== null && passwordRef.current !== null){
      const username = userNameRef.current.value;
      const password = passwordRef.current.value;
    try {
      setLoadingData(true);
      const fetchedUser = await logIn({username, password});
      // add loading animation to button
      setUsernameDoesntExist(false);
      // update redux store
      dispatch(addUser(fetchedUser));
      closeFunc();
    } catch (error) {
      setLoadingData(false);
      // If email already exists
      setUsernameDoesntExist(true);
    }
  }
  }

  useEffect(() => {
    // add red outline to input fields if combination is invalid
    if (userNameRef.current !== null && passwordRef.current !== null) {
      if (usernameDoesntExist) {
        userNameRef.current.classList.add("invalid");
        passwordRef.current.classList.add("invalid");
      } else {
        userNameRef.current.classList.remove("invalid");
        passwordRef.current.classList.remove("invalid");
      }
    }
  }, [usernameDoesntExist]);

  return (
    <div id="logIn-outer" className="modal-outer">
      <div id="logIn-inner" className="modal-inner">
        <div>
          <button type="button" className="close-button" onClick={closeFunc} aria-label="close menu">
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
        </div>
        <div className="division"/>
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
          {usernameDoesntExist ? (
            <span>Incorrect username or password</span>
          ) : null}
          <Button text="" type="submit" onClick={submitLogIn}>
            {loadingData ? (
              <img
                src={loadingIcon}
                alt="loading"
                data-testid="loading-icon"
                className="loading-icon"
              />
            ) : (
              ["Log In"]
            )}
          </Button>
        </form>
        <p>
          First time in reddit? <a href="">Sign Up</a>
        </p>
      </div>
    </div>
  );
}



export default LogInModal;
