import React from 'react';
import { render, screen, container, act, getByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../store/store';
import Comment from '../components/post/Comment';
import userEvent from '@testing-library/user-event';

jest.mock('..//firebase/firebase');

const mockReload = jest.fn();
const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';

describe('Comment', () => {
  test('Display basic comment data', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
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
        </Provider>
      )
    );

    expect(screen.getByText('mockContent')).toBeInTheDocument();
    expect(screen.getByText('mockUser')).toBeInTheDocument();
    expect(screen.getByText(/less/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('Display nested comments', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
      user: 'mockUser',
      upVotes: 10,
      responses: [{
        timePosted: new Date().toString(),
        content: 'anotherMockContent',
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
        </Provider>
      )
    );

    const comments = screen.queryAllByTestId('comment');

    const nestedContent = getByText(comments[1], 'anotherMockContent');

    expect(nestedContent).toBeInTheDocument();
    
  });

  test('Reply button should open a Comment creator', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
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
        </Provider>
      )
    );

    
    expect(screen.queryByTestId("create-post-area")).not.toBeInTheDocument();

    const replyButton = screen.getByTestId('reply-button');

    await act(async () => userEvent.click(replyButton));

    expect(screen.getByTestId("create-post-area")).toBeInTheDocument();

  });

  test('Edit button should be available by default', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
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
        </Provider>
      )
    );
    
    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();

  });

  test('If user is the creator of comment, edit button should be displayed', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
      user: 'mockUser',
      upVotes: 10,
    };

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "mockUser", email: "mock@mock.com", icon },
      });
    });

    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>
      )
    );
    
    expect(screen.queryByTestId("edit-button")).toBeInTheDocument();

  });

  test('Edit button should open a Comment creator', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
      user: 'mockUser',
      upVotes: 10,
    };

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "mockUser", email: "mock@mock.com", icon },
      });
    });

    await act(async () =>
      render(
        <Provider store={store}>
          <Comment
            comment={mockComment}
            subreddit="aww"
            postId="1"
            reloadPost={mockReload}
          />
        </Provider>
      )
    );

    const editButton = screen.queryByTestId("edit-button")

    expect(screen.queryByTestId("create-post-area")).not.toBeInTheDocument();

    userEvent.click(editButton);
   
    expect(screen.getByTestId("create-post-area")).toBeInTheDocument();

  });
});
