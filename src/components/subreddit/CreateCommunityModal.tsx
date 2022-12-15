import React, { useState, useRef } from 'react';
import { func } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSubreddit } from '../../store/subredditsSlice';
import Button from '../Button';
import ImageUpload from '../ImageUpload';
import defaultIcon from '../../assets/default_subreddit_icon.svg';
import loadingIcon from '../../assets/loading.gif';
import { database } from '../../firebase/firebase';

function CreateCommunityModal({ closeFunc }) {
  const formRef = useRef();
  const subNameRef = useRef();
  const subSubtitleRef = useRef();
  const subDescriptionRef = useRef();
  const [nameRemainingLetters, setNameRemainingLetters] = useState(21);
  const [communityIcon, setCommunityIcon] = useState(defaultIcon);
  const [communityIconFile, setCommunityIconFile] = useState();
  const [disableButton, setDisableButton] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function addIcon(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    // show icon preview
    reader.addEventListener('load', () => {
      setCommunityIcon(reader.result)
    }, false);

    setCommunityIconFile(file);
    reader.readAsDataURL(file);
  }

  // This function gets called on every input value change
  // If the whole form is valid, it activates the continue button
  function validate(e) {
    setNameRemainingLetters(21 - subNameRef.current.value.length);
    // Check input validity
    const elementValidity = e.target.validity;
    // Checkt type of validity
    switch (true) {
      case elementValidity.patternMismatch:
        e.target.setCustomValidity('Only letters allowed in community name');
        e.target.parentNode.firstChild.innerText = 'Only letters allowed in username';
        break;
      case elementValidity.tooShort:
        e.target.setCustomValidity('community name must be at least 3 characters long');
        e.target.parentNode.firstChild.innerText = 'Community name must be at least 3 characters long';
        break;
      default:
        e.target.setCustomValidity('');
        e.target.parentNode.firstChild.innerText = '';
    }

    // if form is valid, activate submit button
    setDisableButton(!formRef.current.checkValidity());
  }

  async function submitCreateCommunity(e) {
    e.preventDefault();
    const subredditName = subNameRef.current.value;
    const subtitles = subSubtitleRef.current.value;
    const description = subDescriptionRef.current.value;
    const icon = communityIconFile;
    try {
      // add loading animation
      setLoadingData(true);
      const newSubreddit = await database.createSubreddit(
        subredditName,
        subtitles,
        description,
        icon
      );
      // get subreddit data from database and update redux store
      const fetchedSubreddit = await database.getSubredditData(subredditName);
      dispatch(addSubreddit([fetchedSubreddit]));
      closeFunc();
      // go to subreddit display
      navigate(`/r/${subredditName}`);
    } catch (error) {
      // If email already exists
      setLoadingData(false);
    }
  }

  return (
    <div id="create-community-outer" className="modal-outer">
      <div id="create-community-inner" className="modal-inner">
        <div>
          <button type="button" className="close-button" onClick={closeFunc} aria-label="close menu">
            x
          </button>
          <h1>Create a Comunity</h1>
          <form action="" ref={formRef}>
            <h2>Name</h2>
            <div className="input-wrap">
              <span />
              <input
                type="text"
                placeholder="golfing (example)"
                name="subName"
                id="subName"
                ref={subNameRef}
                onChange={validate}
                pattern="[A-Za-z]*"
                minLength={3}
                maxLength={21}
                required
              />
            </div>
            <p>{nameRemainingLetters} characters remaining</p>
            <h2>Subtitle</h2>
            <div className="input-wrap">
              <span />
              <input
                type="text"
                placeholder="The best golfing community out there!"
                name="subSubtitle"
                id="subSubtitle"
                ref={subSubtitleRef}
                onChange={validate}
                required
              />
            </div>
            <h2>Community description</h2>
            <div className="input-wrap">
              <span />
              <textarea
                placeholder="This will appear in the sidebar of your community"
                name="subDescription"
                id="subDescription"
                ref={subDescriptionRef}
                onChange={validate}
                required
              />
            </div>
            <h2>Community Icon</h2>
            <div>
              <img src={communityIcon} alt="" className='user-icon'/>
              <ImageUpload onChange={addIcon} required={false}/>
            </div>
            <div id="button-area-community">
              <Button text="cancel" light onClick={closeFunc} />
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
