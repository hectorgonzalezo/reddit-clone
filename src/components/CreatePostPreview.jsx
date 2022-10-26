import React from 'react';
import userIcon from '../assets/user_icon.svg';
import linkIcon from '../assets/link_icon.svg';
import imageIcon from '../assets/image_icon.svg';

function CreatePostPreview() {
  return (
    <div id="post-preview" className="main-child">
      <img src={userIcon} alt="" />
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
