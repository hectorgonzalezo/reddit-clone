import React from 'react';
import redditIcon from '../assets/Reddit_Mark_OnWhite.png';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 50px;
  div{
    display: flex;
    align-items: center;
    gap: 15px;
    img{
      width: 32px;
    }
  }
  :root & a{
    color: blue;
  }
  h1{

  }
  h2{
    font-size: 0.85rem;
    font-family: Arial;
  }
  hr{
    border: 1px solid var(--background-color)
  } 
`;

function PostingRules() {
  return (
    <>
      <Container className="main-child">
        <div>
          <img src={redditIcon} alt="" />
          <h1>Posting to Reddit</h1>
        </div>
        <hr />
        <h2>1. Remember the human</h2>
        <hr />
        <h2>2. Behave like you would in real life</h2>
        <hr />
        <h2>3. Look for the original source of content</h2>
        <hr />
        <h2>4. Search for duplicates before posting</h2>
        <hr />
        <h2>5. Read the community&apos;s rules</h2>
      </Container>
      <div id="agreements">
        <p>
          Please be mindfull of reddit's{" "}
          <a href="https://www.redditinc.com/policies/content-policy">
            content policy
          </a>{" "}
          and practice good{" "}
          <a href="https://www.reddit.com/wiki/reddiquette/">reddiquette</a>.
        </p>
      </div>
    </>
  );
}

export default PostingRules;
