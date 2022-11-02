import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../store/store';
import CommentCreator from '../components/post/CommentCreator';

jest.mock('../firebase/firebase');
const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';

describe('CommentCreator', () => {
  test('Display correct user name', async () => {
    await act(async () => {
      store.dispatch({
        type: 'user/addUser',
        payload: { username: 'juan', email: 'mock@mock.com', icon },
      });
    });

    await act(async () =>
      render(
        <Provider store={store}>
          <CommentCreator subreddit="mockSubreddit" postId="123" />
        </Provider>
      )
    );

    expect(screen.getByText(/juan/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('Disable button if textarea has no text', async () => {
    await act(async () => {
      store.dispatch({
        type: 'user/addUser',
        payload: { username: 'juan', email: 'mock@mock.com', icon },
      });
    });

    await act(async () =>
      render(
        <Provider store={store}>
          <CommentCreator subreddit="mockSubreddit" postId="123" />
        </Provider>
      )
    );

    const commentButton = screen.getByRole('button');
    const textarea = screen.getByRole('textbox');

    // Button should be disabled by default
    expect(commentButton).toHaveAttribute('disabled');

    // After typing, button should be enabled
    userEvent.type(textarea, 'text');
    expect(commentButton).not.toHaveAttribute('disabled');

    userEvent.type(textarea, '{selectall}{backspace}');
    expect(commentButton).toHaveAttribute('disabled');
  });
});
