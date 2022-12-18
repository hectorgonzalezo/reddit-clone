import React, { useState, useRef, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSubreddit } from '../../store/subredditsSlice';
import { selectUser } from '../../store/userSlice';
import Button from '../Button';
import ImageUpload from '../ImageUpload';
import defaultIcon from '../../assets/default_subreddit_icon.svg';
import loadingIcon from '../../assets/loading.gif';
import { createSubreddit, getSubreddit } from '../../api/communities';
import SubredditAbout from './SubredditAbout';
import defaultCommunityIcon from '../../defaultCommunityIcon';


interface CreateCommunityModalProps {
  closeFunc: (arg0: SyntheticEvent) => void;
};

function CreateCommunityModal({
  closeFunc = (e) => {},
}: CreateCommunityModalProps): JSX.Element {
  const user = useSelector(selectUser);
  const formRef = useRef<HTMLFormElement | null>(null);
  const subNameRef = useRef<HTMLInputElement | null>(null);
  const subSubtitleRef = useRef<HTMLInputElement | null>(null);
  const subDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [nameRemainingLetters, setNameRemainingLetters] = useState(21);
  const [communityIcon, setCommunityIcon] = useState<string>(defaultIcon);
  const [communityIconFile, setCommunityIconFile] = useState<File>();
  const [disableButton, setDisableButton] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function addIcon(e: SyntheticEvent): void {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    const reader = new FileReader();
    // show icon preview
    reader.addEventListener(
      "load",
      () => {
        const loadedFile = reader.result as string;
        setCommunityIcon(loadedFile);
      },
      false
    );

    setCommunityIconFile(file);
    reader.readAsDataURL(file);
  }

  // This function gets called on every input value change
  // If the whole form is valid, it activates the continue button
  function validate(e: SyntheticEvent): void {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (
      target.parentNode !== null &&
      subNameRef.current !== null &&
      formRef.current !== null
    ) {
      // error display
      const display = target.parentNode.firstChild as HTMLSpanElement;
      setNameRemainingLetters(21 - subNameRef.current.value.length);
      // Check input validity
      const elementValidity = target.validity;
      // Checkt type of validity
      switch (true) {
        case elementValidity.patternMismatch:
          target.setCustomValidity("Only letters allowed in community name");
          display.innerText = "Only letters allowed in username";
          break;
        case elementValidity.tooShort:
          target.setCustomValidity(
            "community name must be at least 3 characters long"
          );
          display.innerText =
            "Community name must be at least 3 characters long";
          break;
        default:
          target.setCustomValidity("");
          display.innerText = "";
      }

      // if form is valid, activate submit button
      setDisableButton(!formRef.current.checkValidity());
    }
  }

  async function submitCreateCommunity(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    if (
      subNameRef?.current !== null &&
      subSubtitleRef?.current !== null &&
      subDescriptionRef?.current !== null
    ) {
      const name = subNameRef.current.value;
      const subtitle = subSubtitleRef.current.value;
      const description = subDescriptionRef.current.value;
      const icon = communityIconFile;
      try {
        // add loading animation
        setLoadingData(true);
        const subData = { name, subtitle, description };
        const newSubreddit = await createSubreddit(
          { name, subtitle, description, icon },
          user.token
        );
        // get subreddit data from database and update redux store
        dispatch(addSubreddit([newSubreddit]));
        closeFunc(e);
        // go to subreddit display
        navigate(`/r/${name}`);
      } catch (error) {
        // If email already exists
        setLoadingData(false);
      }
    }
  }

  return (
    <div id="create-community-outer" className="modal-outer">
      <div id="create-community-inner" className="modal-inner">
        <div>
          <button
            type="button"
            className="close-button"
            onClick={closeFunc}
            aria-label="close menu"
          >
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
              <img src={communityIcon} alt="" className="user-icon" />
              <ImageUpload onChange={addIcon} required={false} />
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


export default CreateCommunityModal;
