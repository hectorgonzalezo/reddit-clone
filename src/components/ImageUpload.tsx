import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';



interface ImageUploadProps {
  onChange: (e: SyntheticEvent) => void;
  id?: string;
  required?: boolean;
};


const UploadArea = styled.div`
  & > .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .App & > .inputfile + label {
    font-size: 1rem;
    font-weight: 500;
    border-radius: 1.5rem;
    padding: 5px 15px 5px 15px;
    color: var(--reddit-blue);
    border: 2px solid var(--reddit-blue);
    background-color: white;
    display: inline-block;
    cursor: pointer;
  }

  & > .inputfile:focus + label,
  & > .inputfile + label:hover {
    background-color: var(--reddit-blue-super-light)
  }
`;

function ImageUpload({
  onChange,
  id = "file",
  required = true,
}: ImageUploadProps): JSX.Element {
  return (
    <UploadArea>
      <input
        type="file"
        name="file"
        id={id}
        className="inputfile"
        onChange={onChange}
        accept="image/png, image/jpeg image/gif"
        required={required}
      />
      <label htmlFor={id} className="image-input">
        Choose a file
      </label>
    </UploadArea>
  );
}



export default ImageUpload;
