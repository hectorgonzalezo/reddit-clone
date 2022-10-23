import React from 'react';
import Button from './Button';
import carretUpIcon from '../assets/carret_up_icon.svg';
import '../styles/topCommunitiesBarStyle.scss';

function TopCommunitiesBar() {
  return (
    <aside id="top-communities-bar" className="main-child">
      <div id="title-communities-bar">
        <div>
          <h1>Top Communities</h1>
        </div>
      </div>
      <div id="list-communities-bar">
        <ol>
          <li>
            <a href="">
              1
              <img src={carretUpIcon} alt="" className="icon" />
              r/mildlyinteresting
            </a>
            <Button text="Join" />{" "}
          </li>
          <li>
            <a href="">
              2
              <img src={carretUpIcon} alt="" className="icon" />
              r/funny
            </a>
            <Button text="Join" />{" "}
          </li>
          <li>
            <a href="">
              3
              <img src={carretUpIcon} alt="" className="icon" />
              r/space
            </a>
            <Button text="Join" />{" "}
          </li>
          <li>
            <a href="">
              4
              <img src={carretUpIcon} alt="" className="icon" />
              r/worldnews
            </a>
            <Button text="Join" />{" "}
          </li>
          <li>
            <a href="">
              5
              <img src={carretUpIcon} alt="" className="icon" />
              r/Dammthatsinteresting
            </a>
            <Button text="Join" />{" "}
          </li>
        </ol>
      </div>
      <div id="buttons-communities-bar">
        <Button text="View all" />
        <Button text="Top" light />
        <Button text="Sports" light />
        <Button text="News" light />
        <Button text="Aww" light />
      </div>
    </aside>
  );
}

export default TopCommunitiesBar;
