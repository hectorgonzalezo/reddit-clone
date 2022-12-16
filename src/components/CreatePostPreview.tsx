import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import linkIcon from '../assets/link_icon.svg';
import imageIcon from '../assets/image_icon.svg';
import { selectUser } from '../store/userSlice';

function CreatePostPreview(): JSX.Element {
  const user = useSelector(selectUser);

  return (
    <div id="post-preview" className="main-child">
      <img src={user.icon} alt="" className="user-icon" />
      <Link to={user.username !== undefined ? '/create-post/textArea' : '/'} >
        <input type="text" placeholder="Create Post" className="main-input" />
      </Link>
      <Link to={user.username !== undefined ? '/create-post/imgArea' : '/'}>
        <img src={imageIcon} className="icon" alt="" />
      </Link>
      <Link to={user.username !== undefined ? '/create-post/urlArea' : '/'}>
        <img src={linkIcon} className="icon" alt="" />
      </Link>
    </div>
  );
}

export default CreatePostPreview;
