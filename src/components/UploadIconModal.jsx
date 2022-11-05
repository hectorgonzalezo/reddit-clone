import React, { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { func } from 'prop-types';
import { addUser, updateIcon } from '../store/userSlice';
import ImageUpload from './ImageUpload';
import Button from './Button';
import loadingIcon from '../assets/loading.gif';
import { database } from '../firebase/firebase';
import { selectUser } from '../store/userSlice';

function UploadIconModal({ closeFunc }) {
  const [disableButton, setDisableButton] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [iconFile, setIconFile] = useState();

  function addIcon(e) {
    setIconFile(e.target.files[0]);
    setDisableButton(false);
  }

  async function uploadIcon(e) {
    e.preventDefault();
    try {
      setLoadingData(true);
      console.log(iconFile, user.username)
      const icon = await database.saveUserIcon(iconFile, user.username);
      console.log(icon)
      dispatch(updateIcon(icon));
      setLoadingData(false);
      closeFunc();
    } catch (error){
      console.log(error)
      setLoadingData(false);
    }
  }

  return (
    <div id="uploadIcon-outer" className="modal-outer">
      <div id="uploadIcon-inner" className="modal-inner">
        <button type="button" className="close-button" onClick={closeFunc} aria-label="close menu">
          x
        </button>
        <form action="">
          <ImageUpload onChange={addIcon} />
          <Button
            text=""
            type="submit"
            disabled={disableButton}
            onClick={uploadIcon}
          >
            {loadingData ? (
              <img src={loadingIcon} alt="loading" data-testid="loading-icon" />
            ) : (
              ['Submit']
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

UploadIconModal.defaultProps = {
  closeFunc: () => {},
};

UploadIconModal.propTypes = {
  closeFunc: func,
};

export default UploadIconModal;
