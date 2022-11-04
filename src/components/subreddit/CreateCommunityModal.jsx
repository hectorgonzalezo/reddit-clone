import React, { useState, useRef } from 'react';
import { func } from 'prop-types';
import { useDispatch } from 'react-redux';
import { addUser } from '../../store/userSlice';
import Button from '../Button';
import ImageUpload from '../ImageUpload';
import loadingIcon from '../../assets/loading.gif';
import { authorization } from '../../firebase/firebase';

function CreateCommunityModal({ closeFunc }) {
  const formRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const password1Ref = useRef();
  const password2Ref = useRef();
  const [disableButton, setDisableButton] = useState(true);
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

  async function submitCreateCommunity(e) {
    e.preventDefault();
    const username = userNameRef.current.value;
    const email = emailRef.current.value;
    const password = password1Ref.current.value;
    const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
    const votes = {};
    try {
      // add loading animation
      setLoadingData(true);
      const account = await authorization.createAccount(email, password, username);
      // update redux store
      dispatch(addUser({ username, email, icon, votes }));
      closeFunc();
    } catch (error) {
      // If email already exists
      setLoadingData(false);
    }
  }

  return (
    <div id="create-community-outer" className="modal-outer">
      <div id="create-community-inner" className="modal-inner">
        <div>
          <button type="button" className="close-button" onClick={closeFunc}>
            x
          </button>
          <h1>Create a Comunity</h1>
          <form action="" ref={formRef}>
            <h2>Name</h2>
            <p>Community names including capitalization cannot be changed</p>
            <div className="input-wrap">
              <span />
              <input
                type="text"
                placeholder=""
                name="username"
                id="username"
                ref={userNameRef}
                onChange={validate}
                pattern="[A-Za-z0-9]*"
                maxLength={21}
                required
              />
              <label htmlFor="username">Username</label>
            </div>
            <p>21 characters remaining</p>
            <h2>Community Icon</h2>
            <ImageUpload />
            <div id="button-area">
              <Button text="cancel" light />
              <Button
                text=""
                type="submit"
                disabled={disableButton}
                onClick={submitCreateCommunity}
              >
                {loadingData ? (
                  <img
                    src={loadingIcon}
                    alt="loading"
                    data-testid="loading-icon"
                    className="loading-icon"
                  />
                ) : (
                  ["Create Community"]
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

CreateCommunityModal.defaultProps = {
  closeFunc: () => {},
};

CreateCommunityModal.propTypes = {
  closeFunc: func,
};

export default CreateCommunityModal;
