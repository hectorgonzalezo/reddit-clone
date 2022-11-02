import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter} from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Post from '../components/post/Post';
import store from '../store/store';

jest.mock('../firebase/firebase');

const mockPost = {
  subredditName: 'aww',
  subredditIcon: undefined,
  poster: 'yo',
  title: 'Title',
  text: 'Hey!',
  imageUrl:
    'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/postImages%2Fbar%2Fimages58b82c35dcf6e61433da9494.png?alt=media&token=c77db72a-07d3-4c61-9a2c-cfc86e8e4bb1',
  postId: '0',
  upVotes: 10,
  timePosted: new Date().toString(),
  comments: [
    {
      content: 'content',
      timePosted: (new Date()).toString(),
      upVotes: 10,
      user: 'juan',
    },
  ],
};

const {
  subredditName,
  subredditIcon,
  poster,
  title,
  text,
  imageUrl,
  upVotes,
  timePosted,
  comments,
  postId,
} = mockPost;

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
describe('Post previews', () => {
  test('Render title and basic info', () => {
    // render mock post preview
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: `u/${poster}` })
    ).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(`r/${subredditName}`)).toBeInTheDocument();
    expect(screen.getByText(`u/${poster}`)).toBeInTheDocument();
    expect(screen.getByText("1 Comments")).toBeInTheDocument();

    // dont render comments display
    expect(screen.queryByTestId("comments-display")).not.toBeInTheDocument();

    // post should be preview
    expect(container).toMatchSnapshot();
  });

  test('Render text if given one', () => {
    // render mock post preview
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            text={text}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();

    const textContent = screen.getByText('Hey!');
    expect(textContent).toBeInTheDocument();


    expect(container).toMatchSnapshot();
  });

  test('Given an imageUrl display it', () => {
    // render mock post preview
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            img={imageUrl}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();

    const imageContent = screen.getByTestId('image-content');
    expect(imageContent).toBeInTheDocument();
    expect(imageContent).toHaveAttribute('src', mockPost.imageUrl);

    expect(container).toMatchSnapshot();
  });

  test('Pressing upvote and downvote buttons disabled if no user is logged in', () => {
    // render mock post preview
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    userEvent.click(upVoteImage);
    userEvent.click(downVoteImage);

    expect(votesNumber).toHaveStyle('color: black');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });

  test('Pressing upvote updates number and changes icon color', async () => {

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    userEvent.click(upVoteImage);

    expect(votesNumber.textContent).toBe('11');
    expect(upVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Pressing downvote updates number and changes icon color', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    userEvent.click(downVoteImage);

    expect(votesNumber.textContent).toBe('9');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Pressing upvote twice removes previous vote', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    userEvent.click(upVoteImage);
    userEvent.click(upVoteImage);

    expect(votesNumber.textContent).toBe('10');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Pressing downvote twice removes previous vote', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    userEvent.click(downVoteImage);
    userEvent.click(downVoteImage);

    expect(votesNumber.textContent).toBe('10');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Only leaves result of last pressed vote button', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    userEvent.click(upVoteImage);
    userEvent.click(downVoteImage);

    expect(votesNumber.textContent).toBe('9');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');

    userEvent.click(upVoteImage);
    expect(votesNumber.textContent).toBe('11');
    expect(upVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
});

describe('Post with comments', () => {
  test('Post isnt preview by default', async () => {
    // render mock post preview
    await act(async () => {render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={poster}
            timePosted={timePosted}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    )
    });

    // post should be preview
    expect(screen.getByTestId('post-container')).not.toHaveProperty('preview', true);
    // there should be an area to add a comment
    expect(screen.getByTestId('create-post-area')).toBeInTheDocument();
    // there should be a comments area
    expect(screen.getByTestId('comments-display')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
})