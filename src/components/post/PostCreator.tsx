import React, { SyntheticEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectUser } from '../../store/userSlice';
import CommunityChooser from '../CommunityChooser';
import PostingRules from './PostingRules';
import ImageUpload from '../ImageUpload';
import Button from '../Button';
import { database } from '../../firebase/firebase';
import postIcon from '../../assets/post_icon.svg';
import imagesIcon from '../../assets/images_icon.svg';
import linkIcon from '../../assets/link_icon.svg';
import loadingIcon from '../../assets/loading.gif';
import '../../styles/postCreatorStyle.scss';

function PostCreator(): JSX.Element {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const selectedButton = useRef<HTMLButtonElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [textContent, setTextContent] = useState('');
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>();
  const [fileToUpload, setFileToUpload] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  let { initialType } = useParams<string>();
  // by default should be textArea
  if (initialType === undefined) {
    initialType = 'textArea';
  }

  const inputs: { [index: string]: JSX.Element } = {
    textArea: (
      <textarea
        id="text-area"
        cols={30}
        rows={10}
        placeholder="Text (optional)"
        onChange={updateTextContent}
      />
    ),
    urlArea: (
      <textarea
        id="url-area"
        cols={30}
        rows={2}
        placeholder="Url"
        onChange={updateTextContent}
        required
      />
    ),
    imgArea: (
      <ImageUpload id="img-area" onChange={updateFileToUpload} required />
    ),
  };

  const [mediaType, setMediaType] = useState<JSX.Element>(inputs[initialType]);

  // used by both text areas onChange
  function updateTextContent(e: SyntheticEvent): void {
    const target = e.target as HTMLInputElement;
    const content = target.value;
    setTextContent(content);
  }

  // used by imgArea
  function updateFileToUpload(e: SyntheticEvent): void {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const newFile = target.files[0];
      setFileToUpload(newFile);
    }
  }

  // switches between text, images and link inputs
  function addMediaType(): void {
    if (selectedButton.current !== null) {
    const type = selectedButton.current.getAttribute('data-type');
    switch (type) {
      case 'post':
        setMediaType(inputs.textArea);
        break;
      case 'image':
        setMediaType(inputs.imgArea);
        break;
      case 'link':
        setMediaType(inputs.urlArea);
        break;
      default:
        break;
    }
  }
  }

  // Selects a type of media button
  function selectMedia(e: SyntheticEvent): void {
    const target = e.target as HTMLButtonElement;
    if (selectedButton.current !== null) {
      selectedButton.current.classList.remove('selected');
      target.classList.add('selected');
      selectedButton.current = target;
      addMediaType();
    }
  }

  // adds a post to database
  async function submitPost(): Promise<void> {
    const { username } = user;
    if ( titleRef.current !== null) {
    const title = titleRef.current.value;
    const subreddit = selectedSubreddit;
    const text = textContent;
    const image = fileToUpload;
    let id;

    // add loading animation to button
    setIsLoading(true);

    // depending on the type of media to be upload, choose an appropriate database method
    // extract the id of the element to identify the type
    switch (mediaType.props.id) {
      case 'text-area':
        id = await database.addTextPost(username, title, subreddit, text);
        loadPost(id);
        break;
      case 'img-area':
        id = await database.addImagePost(username, title, subreddit, image);
        loadPost(id);
        break;
      case 'url-area':
        id = await database.addUrlPost(username, title, subreddit, text);
        loadPost(id);
        break;
      default:
        setIsLoading(false);
        break;
    }
  }
  }

  function loadPost(id: string): void {
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/r/${selectedSubreddit as string}/${id}`);
    }, 1000);
  }

  return (
    <>
      <div id="left-side">
        <h1 id="create-post-title">Create a post</h1>
        <CommunityChooser onChoosing={setSelectedSubreddit} />
        <div id="post-creator" className="main-child">
          <div id="buttons-div" data-testid="buttons-div">
            <button
              type="button"
              className={initialType === "textArea" ? "selected" : ""}
              ref={selectedButton}
              onClick={selectMedia}
              data-type="post"
            >
              <img src={postIcon} alt="" />
              Post
            </button>
            <button
              type="button"
              className={initialType === "imgArea" ? "selected" : ""}
              onClick={selectMedia}
              data-type="image"
            >
              <img src={imagesIcon} alt="" />
              Images & Video
            </button>
            <button
              type="button"
              className={initialType === "urlArea" ? "selected" : ""}
              onClick={selectMedia}
              data-type="link"
            >
              <img src={linkIcon} alt="" />
              Link
            </button>
          </div>
          <form action="" id="post-form" aria-label="Submit Form">
            <input type="text" placeholder="Title" ref={titleRef} />
            {mediaType}
            <Button
              onClick={submitPost}
              disabled={selectedSubreddit === null ? true : false}
            >
              {isLoading ? (
                <img
                  src={loadingIcon}
                  alt="loading icon"
                  className="loading-icon"
                />
              ) : (
                "Post"
              )}
            </Button>
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
