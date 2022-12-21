import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter} from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Post from '../components/post/Post';
import store from '../store/store';

jest.mock('../api/users');
jest.mock('../api/posts');

const mockPost = {
  community: '123456789b123456789c1234',
  subredditName: 'aww',
  subredditIcon: '',
  user: {_id: '123456789a123456789b1234', username: "juan" },
  title: 'Title',
  text: 'Hey!',
  url:
    'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/postImages%2Fbar%2Fimages58b82c35dcf6e61433da9494.png?alt=media&token=c77db72a-07d3-4c61-9a2c-cfc86e8e4bb1',
  postId: '0',
  upVotes: 10,
  createdAt: new Date().toString(),
  comments: [
    {
      text: 'content',
      createdAt: (new Date()).toString(),
      upVotes: 10,
      user: '123456789a123456789b1234',
    },
  ],
};

const {
  subredditName,
  subredditIcon,
  user,
  title,
  text,
  url,
  upVotes,
  createdAt,
  comments,
  postId,
} = mockPost;

beforeEach(async () =>{
  await act(async () => {
    store.dispatch({
      type: "subreddits/addSubreddit",
      payload: [
        {
          _id: "123456789b123456789c1234",
          name: "aww",
        },
      ],
    });
  });
})


const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/poster_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
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
            poster={user}
            timePosted={createdAt}
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
      screen.getByRole("link", { name: `u/${user.username}` })
    ).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(`r/${subredditName}`)).toBeInTheDocument();
    expect(screen.getByText(`u/${user.username}`)).toBeInTheDocument();
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
            poster={user}
            timePosted={createdAt}
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
            poster={user}
            timePosted={createdAt}
            title={title}
            img={url}
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
    expect(imageContent).toHaveAttribute('src', mockPost.url);

    expect(container).toMatchSnapshot();
  });

  test('Pressing upvote and downvote buttons disabled if no poster is logged in', async () => {
    // render mock post preview
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post
            preview
            key={title}
            subredditName={subredditName}
            subredditIcon={subredditIcon}
            poster={user}
            timePosted={createdAt}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const voteButtons = screen.getAllByTestId('icon-link');
    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    await act(() => userEvent.click(voteButtons[0]));
    await act(() => userEvent.click(voteButtons[1]));

    expect(votesNumber).toHaveStyle('color: black');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });

  test('Pressing upvote updates number and changes icon color', async () => {

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
          },
          token: "1234701923491273401243",
        },
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
            poster={user}
            timePosted={createdAt}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const voteButtons = screen.getAllByTestId('icon-link');
    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    await act(() => userEvent.click(voteButtons[0]));

    expect(votesNumber.textContent).toBe('11');
    expect(upVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Pressing downvote updates number and changes icon color', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
          },
          token: "1234701923491273401243",
        },
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
            poster={user}
            timePosted={createdAt}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const voteButtons = screen.getAllByTestId('icon-link');
    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    await act(() => userEvent.click(voteButtons[1]));

    expect(votesNumber.textContent).toBe('9');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Pressing upvote twice removes previous vote', async () => {

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
          },
          token: "1234701923491273401243",
        },
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
            poster={user}
            timePosted={createdAt}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const voteButtons = screen.getAllByTestId('icon-link');
    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    await act(() => userEvent.click(voteButtons[0]));
    await act(() => userEvent.click(voteButtons[0]));

    expect(votesNumber.textContent).toBe('10');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Pressing downvote twice removes previous vote', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
          },
          token: "1234701923491273401243",
        },
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
            poster={user}
            timePosted={createdAt}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const voteButtons = screen.getAllByTestId('icon-link');
    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    await act(() => userEvent.click(voteButtons[1]));
    await act(() => userEvent.click(voteButtons[1]));

    expect(votesNumber.textContent).toBe('10');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');
  });
  test('Only leaves result of last pressed vote button', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
          },
          token: "1234701923491273401243",
        },
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
            poster={user}
            timePosted={createdAt}
            title={title}
            postId={postId}
            upVotes={upVotes}
            comments={comments}
          />
        </BrowserRouter>
      </Provider>
    );

    const voteButtons = screen.getAllByTestId('icon-link');
    const upVoteImage = screen.getByTestId('up-vote-img');
    const downVoteImage = screen.getByTestId('down-vote-img');
    const votesNumber = screen.getByTestId('votes-display');

    await act(() => userEvent.click(voteButtons[0]));
    await act(() => userEvent.click(voteButtons[1]));

    expect(votesNumber.textContent).toBe('9');
    expect(upVoteImage).not.toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(0deg)');
    expect(downVoteImage).toHaveStyle('filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg)');

    await act(() => userEvent.click(voteButtons[0]));
    
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
            poster={user}
            timePosted={createdAt}
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