import React, { SyntheticEvent, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserIcon } from '../api/users';
import ImageUpload from './ImageUpload';
import Button from './Button';
import loadingIcon from '../assets/loading.gif';
import { selectUser, addUser } from '../store/userSlice';

interface UploadIconModalProps {
  closeFunc: () => void;
};

function UploadIconModal({
  closeFunc = () => {},
}: UploadIconModalProps): JSX.Element {
  const [disableButton, setDisableButton] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [iconFile, setIconFile] = useState<File>();

  function addIcon(e: SyntheticEvent): void{
    const target = e.target as HTMLInputElement;
    if( target.files !== null) {
      setIconFile(target.files[0]);
      setDisableButton(false);
    }
  }

  async function uploadIcon(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    try {
      setLoadingData(true);
      const updatedUser = await saveUserIcon(iconFile as File, user);
      console.log({updatedUser});
      dispatch(addUser(updatedUser));
      setLoadingData(false);
      closeFunc();
    } catch (error) {
      console.log(error);
      setLoadingData(false);
    }
  }

  return (
    <div id="uploadIcon-outer" className="modal-outer">
      <div id="uploadIcon-inner" className="modal-inner">
        <button
          type="button"
          className="close-button"
          onClick={closeFunc}
          aria-label="close menu"
        >
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
              ["Submit"]
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}



export default UploadIconModal;
