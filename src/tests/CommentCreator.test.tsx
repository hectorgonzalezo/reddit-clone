import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, container, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../store/store';
import CommentCreator from '../components/post/CommentCreator';

jest.mock('../api/users');

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';


beforeAll(async() => {
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
        token: '1234701923491273401243'
      },
    });
  });
})


describe('CommentCreator', () => {
  test('Display correct user name', async () => {

    await act(async () =>
      render(
        <Provider store={store}>
          <CommentCreator subreddit="mockSubreddit" postId="123" reloadPost={() => {}} />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );

    expect(screen.getByText(/juan/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('Disable button if textarea has no text', async () => {

    await act(async () =>
      render(
        <Provider store={store}>
          <CommentCreator subreddit="mockSubreddit" postId="123" reloadPost={() => {}} />
        </Provider>,
        { wrapper: MemoryRouter }
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
