import React from 'react';
import { render, screen, container, act, getByRole, getAllByRole } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../store/store';
import JoinButton from '../components/subreddit/Joinbutton';

jest.mock('../firebase/firebase');
const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';

const mockSubreddit = {
  name: 'aww',
  dateCreated: (new Date()).toString(),
  description:
      'Things that make you go AWW! Like puppies, bunnies, babies, and so on... A place for really cute pictures and videos!',
  icon,
  members: 0,
  postQuantity: 3,
  subtitle: 'A subreddit for cute and cuddly pictures',
};

describe('Button that allows user to join a subreddit', () => {
  test('Displays "Join" if user isnt subscribed  to subreddit', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          username: "juan",
          email: "mock@mock.com",
          icon,
          subreddits: [],
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
          username: "juan",
          email: "mock@mock.com",
          icon,
          subreddits: ['aww'],
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
          username: "juan",
          email: "mock@mock.com",
          icon,
          subreddits: ['aww'],
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

  test('Clicking join button adds subreddit to user', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: {
          username: "juan",
          email: "mock@mock.com",
          icon,
          subreddits: [],
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
    await act(async () => userEvent.click(button));
    // update state
    expect(store.getState().user.subreddits.includes('aww')).toBe(true);

    // clicking it again, removes it
    await act(async () => userEvent.click(button));
    // update state
    expect(store.getState().user.subreddits.includes('aww')).toBe(false);
  });
});
