import React from 'react';
import upIcon from '../assets/upvote_icon.svg';
import downIcon from '../assets/downvote_icon.svg';
import commentsIcon from '../assets/comments_icon.svg';
import awardIcon from '../assets/award_icon.svg';
import shareIcon from '../assets/share_icon.svg';
import saveIcon from '../assets/save_icon.svg';
import hideIcon from '../assets/hide_icon.svg';
import IconLink from './IconLink';
import styled from 'styled-components';

const Post = styled.article`
  display: grid;
  gap: 10px;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 20px 1fr 30px;
  grid-template-areas: 
                       "vote sub"
                       "vote main"
                       "vote comm";

  em {
    font-weight: bold;
    color: black;
  }

  div {
    display: flex;
  }
  &:hover{
    outline: 1px solid grey;
    cursor: pointer;
  }

  & > .vote-area-post{
    grid-area: vote;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  & > .top-area-post{
    grid-area: sub;
    p{
      font-size: 0.8rem;
      color: grey;
    }
  }

  & > .main-area-post{
    grid-area: main;
  }

  & > .bottom-area-post{
    grid-area: comm;
  }
`;

function PostPreview() {
  return (
    <Post className="main-child">
      <div className="vote-area-post">
        <IconLink fill="orange">
          <img src={upIcon} alt="" />
        </IconLink>
        <p>19</p>
        <IconLink fill="blue">
          <img src={downIcon} alt="" />
        </IconLink>
      </div>
      <div className="top-area-post">
        <p><em>r/AskReddit</em></p>
        <p>&nbsp;•&nbsp;</p>
        <p> Posted by u/Hector 5 hours ago</p>
      </div>
      <div className="main-area-post">
        <h1>What 90s Song will always be a banger?</h1>
      </div>
      <div className="bottom-area-post">
        <IconLink>
          <img src={commentsIcon} alt="" className="icon" />
          <p>73 Comments</p>
        </IconLink>
        <IconLink>
          <img src={awardIcon} alt="" className="icon" />
          <p>Award</p>
        </IconLink>
        <IconLink>
          <img src={shareIcon} alt="" className="icon" />
          <p>Share</p>
        </IconLink>
        <IconLink>
          <img src={saveIcon} alt="" className="icon" />
          <p>Save</p>
        </IconLink>
        <IconLink>
          <img src={hideIcon} alt="" className="icon" />
          <p>Hide</p>
        </IconLink>
      </div>
    </Post>
  );
}

export default PostPreview;
