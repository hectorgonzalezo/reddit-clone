import React from 'react';
import { render, screen, container, act, getByRole, getAllByRole } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../store/store';
import JoinButton from '../components/subreddit/Joinbutton';

jest.mock('../api/users');
jest.mock('../api/communities');

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';

const mockSubreddit = {
  name: 'aww',
  description:
      'Things that make you go AWW! Like puppies, bunnies, babies, and so on... A place for really cute pictures and videos!',
  icon,
  members: 0,
  postQuantity: 3,
  subtitle: 'A subreddit for cute and cuddly pictures',
  _id: '123456789b123456789c1234'
};

// Add user
beforeEach(async () => {
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
})

describe('Button that allows user to join a subreddit', () => {
  test('Displays "Join" if user isnt subscribed  to subreddit', async () => {

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
            communities: [],
          },
          token: "1234701923491273401243",
        },
      });
    });

    await act(async () => {
      store.dispatch({
        type: "subreddits/addSubreddit",
        payload: [mockSubreddit],
      });
    });

    render(
      <Provider store={store}>
        <JoinButton subreddit="aww" />
      </Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Join');
  });

  test('Displays "Joined" if user is subscribed  to subreddit', async () => {

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
            communities: [mockSubreddit._id],
          },
          token: "1234701923491273401243",
        },
      });
    });

    await act(async () => {
      store.dispatch({
        type: "subreddits/addSubreddit",
        payload: [mockSubreddit],
      });
    });

    render(
      <Provider store={store}>
        <JoinButton subreddit="aww" />
      </Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Joined');
  });

  test('Displays "Leave" if user is subscribed  to subreddit and hover on button', async () => {

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          user: {
            username: "juan",
            email: "mock@mock.com",
            icon,
            _id: "123456789a123456789b1234",
            communities: [mockSubreddit._id],
          },
          token: "1234701923491273401243",
        },
      });
    });

    await act(async () => {
      store.dispatch({
        type: "subreddits/addSubreddit",
        payload: [mockSubreddit],
      });
    });

    render(
      <Provider store={store}>
        <JoinButton subreddit="aww" />
      </Provider>
    );

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Joined');
    userEvent.hover(button);
    expect(button).toHaveTextContent('Leave');
    userEvent.unhover(button);
    expect(button).toHaveTextContent('Joined');
  });
});
