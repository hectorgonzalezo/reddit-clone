import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, container, act, getByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../store/store';
import Comment from '../components/post/Comment';
import userEvent from '@testing-library/user-event';

jest.mock('../api/users');

const mockReload = jest.fn();
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

describe('Comment', () => {
  test('Display basic comment data', async () => {
    const mockComment = {
      createdAt: new Date().toString(),
      text: "mocktext",
      user: { username: "mockUser" },
      upVotes: 10,
    };
    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );

    expect(screen.getByText('mocktext')).toBeInTheDocument();
    expect(screen.getByText('mockUser')).toBeInTheDocument();
    expect(screen.getByText(/less/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('Display nested comments', async () => {
    const mockComment = {
      createdAt: new Date().toString(),
      text: 'mocktext',
      user: 'mockUser',
      upVotes: 10,
      responses: [{
        createdAt: new Date().toString(),
        text: 'anotherMocktext',
        user: 'anotherMockUser',
        upVotes: 1,
      }],
    };
    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );

    const comments = screen.queryAllByTestId('comment');

    const nestedtext = getByText(comments[1], 'anotherMocktext');

    expect(nestedtext).toBeInTheDocument();
    
  });

  test('Reply button should open a Comment creator', async () => {
    const mockComment = {
      createdAt: new Date().toString(),
      text: 'mocktext',
      user: 'mockUser',
      upVotes: 10,
    };
    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );

    
    expect(screen.queryByTestId("create-post-area")).not.toBeInTheDocument();

    const replyButton = screen.getByTestId('reply-button');

    await act(async () => userEvent.click(replyButton));

    expect(screen.getByTestId("create-post-area")).toBeInTheDocument();

  });

  test('Edit button should be available by default', async () => {
    const mockComment = {
      createdAt: new Date().toString(),
      text: 'mocktext',
      user: 'mockUser',
      upVotes: 10,
    };

    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );
    
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();

  });

  test('If user is the creator of comment, edit button should be displayed', async () => {
    const mockComment = {
      createdAt: new Date().toString(),
      text: 'mocktext',
      user: "123456789a123456789b1234",
      upVotes: 10,
    };


    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );
    
    expect(screen.queryByTestId("edit-button")).toBeInTheDocument();

  });

  test('Edit button should open a Comment creator', async () => {
    const mockComment = {
      createdAt: new Date().toString(),
      text: 'mocktext',
      user: "123456789a123456789b1234",
      upVotes: 10,
    };

    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>,
        { wrapper: MemoryRouter }
      )
    );

    const editButton = screen.queryByTestId("edit-button")

    expect(screen.queryByTestId("create-post-area")).not.toBeInTheDocument();

    userEvent.click(editButton);
   
    expect(screen.getByTestId("create-post-area")).toBeInTheDocument();

  });
});
