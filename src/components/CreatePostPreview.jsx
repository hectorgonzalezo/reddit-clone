import React from 'react';
import linkIcon from '../assets/link_icon.svg';
import imageIcon from '../assets/image_icon.svg';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/userSlice';

function CreatePostPreview() {
  const user = useSelector(selectUser);

  return (
    <div id="post-preview" className="main-child">
      <img src={user.icon} alt="" className="user-icon" />
      <input type="text" placeholder="Create Post" className="main-input" />
      <a href="">
        <img src={imageIcon} className="icon" alt="" />
      </a>
      <a href="">
        <img src={linkIcon} className="icon" alt="" />
      </a>
    </div>
  );
}

export default CreatePostPreview;
