import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectSubreddits } from '../../store/subredditsSlice';
import TopCommunitiesBar from '../TopCommunitiesBar';
import Button from '../Button';
import Agreements from '../Agreements';
import JoinButton from './Joinbutton';
import styled from 'styled-components';

const AllCommunities = styled.div`
  h1{
    background-color: var(--background-color);
    margin: -10px;
    margin-bottom: 0px;
    padding: 10px;
    font-size: 1.3rem;
  }

  ol{
    li{ 
      & > a{
      display: grid; 
      grid-template-columns: auto auto 1fr auto;
      align-items: center;
      gap: 15px;
      padding: 10px;
      width: 100%;
      justify-items: start;
      font-size: 1rem;
      border: none;
      border-top: 1px solid var(--background-color);
      background-color: white;

      &:hover{
        cursor: pointer;
      }

      img{
        width: 36px;
        border-radius: 100%;
      }
      button{
      }
    }
    }
  }
`;

function AllSubreddits(): JSX.Element {
  const subredditsData = useSelector(selectSubreddits);
  const navigate = useNavigate();

  return (
    <>
      <div id="left-side">
        <AllCommunities className="main-child">
          <h1>All communities</h1>
          <ol>
            {Object.values(subredditsData).map((subreddit, i) => (
              <li key={`${subreddit.name}-list-item`}>
                <a
                  key={`${subreddit.name}-list-link`}
                  onClick={() => navigate(`/r/${subreddit.name}`)}
                >
                  <p key={`${subreddit.name}-list-number`}>{i + 1}</p>
                  <img
                    src={subreddit.icon}
                    alt=""
                    key={`${subreddit.name}-icon`}
                  />
                  <p key={`${subreddit.name}-list-name`}>r/{subreddit.name}</p>
                  <JoinButton
                    subreddit={subreddit.name}
                    key={`${subreddit.name}-list-join-button`}
                  />
                </a>
              </li>
            ))}
          </ol>
        </AllCommunities>
      </div>
      <div id="right-side">
        <TopCommunitiesBar />
        <Agreements />
        <Button
          text="Back to Top"
          onClick={() => window.scrollTo({ top: 0 })}
        />
      </div>
    </>
  );
}

export default AllSubreddits;
