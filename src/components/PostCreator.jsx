import React, { useRef, useState } from 'react';
import CommunityChooser from './CommunityChooser';
import PostingRules from './PostingRules';
import ImageUpload from './ImageUpload';
import Button from './Button';
import postIcon from '../assets/post_icon.svg';
import imagesIcon from '../assets/images_icon.svg';
import linkIcon from '../assets/link_icon.svg';
import '../styles/postCreatorStyle.scss';

function PostCreator() {
  const selectedButton = useRef();
  const [mediaType, setMediaType] = useState(<textarea name="" id="" cols="30" rows="10" placeholder="Text (optional)" />)
  const textArea = <textarea id="text-area" cols="30" rows="10" placeholder="Text (optional)" />;
  const urlArea = <textarea id="url-area" cols="30" rows="2" placeholder="Url" required /> ;

   // switches between text, images and link inputs
   function addMediaType() {
    const type = selectedButton.current.getAttribute('data');
    switch (type) {
      case 'post':
        setMediaType(textArea)
        break;
      case 'image':
        setMediaType(<ImageUpload />);
        break;
      case 'link':
        setMediaType(urlArea)
        break;
      default:
        break;
    };
  }

  // Selects a type of media button
  function selectMedia(e) {
    selectedButton.current.classList.remove('selected');
    e.target.classList.add('selected');
    selectedButton.current = e.target;
    
    addMediaType();
  }

 

  return (
    <>
      <div id="left-side">
        <h1>Create a post</h1>
        <hr />
        <CommunityChooser />
        <div id="post-creator" className="main-child">
          <div id="buttons-div" data-testid="buttons-div">
            <button
              type="button"
              className="selected"
              ref={selectedButton}
              onClick={selectMedia}
              data="post"
            >
              <img src={postIcon} alt="" />
              Post
            </button>
            <button type="button" onClick={selectMedia} data="image">
              <img src={imagesIcon} alt="" />
              Images & Video
            </button>
            <button type="button" onClick={selectMedia} data="link">
              <img src={linkIcon} alt="" />
              Link
            </button>
          </div>
          <form action="" id="post-form" aria-label="Submit Form">
            <input type="text" placeholder="Title" />
            {mediaType}
            <Button text="Post" />
          </form>
        </div>
      </div>
      <div id="right-side">
       <PostingRules /> 
      </div>
    </>
  );
}

export default PostCreator;
