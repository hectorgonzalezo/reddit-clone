import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, container, act, getByRole, queryAllByRole } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import store from '../store/store';
import PostCreator from '../components/post/PostCreator';
import { getStorage } from 'firebase/storage';

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';

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
          communities: ["123456789b123456789c1234"],
        },
        token: "1234701923491273401243",
      },
    });
  });
})

describe('Post creator page', () => {
  test('Post starts highlighted', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );
    const buttonsArea = screen.getByTestId('buttons-div');
    const postButton = getByRole(buttonsArea, 'button', { name: 'Post' });
    
    expect(postButton).toHaveClass('selected');

    expect(container).toMatchSnapshot();
  });

  test('Pressing on media button highlights it and deselects the rest', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );
    const buttonsArea = screen.getByTestId('buttons-div');;
    const postButton = getByRole(buttonsArea, 'button', { name: 'Post' });
    const imagesButton = getByRole(buttonsArea, 'button', { name: 'Images & Video' });
    const linkButton = getByRole(buttonsArea, 'button', { name: 'Link' });

    userEvent.click(linkButton);
    
    expect(postButton).not.toHaveClass('selected');
    expect(imagesButton).not.toHaveClass('selected');
    expect(linkButton).toHaveClass('selected');
  });

  test('By default shows text area with text placeholder', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );
    const form = screen.getByRole('form');
    const textArea = queryAllByRole(form, 'textbox');
    
    expect(textArea[1]).toBeInTheDocument();
    expect(textArea[1].placeholder).toEqual('Text (optional)');
  });

  test('Pressing on images button shows file input', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );
    const form = screen.getByRole('form');
    const buttonsArea = screen.getByTestId('buttons-div');;
    const imagesButton = getByRole(buttonsArea, 'button', { name: 'Images & Video' });

    userEvent.click(imagesButton);
    const imageInput = screen.getByText('Choose a file');
    
    expect(imageInput).toBeInTheDocument();
  });

  test('Pressing on link button shows link textarea', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );
    const form = screen.getByRole('form');
    const buttonsArea = screen.getByTestId('buttons-div');
    const linkButton = getByRole(buttonsArea, 'button', { name: 'Link' });

    userEvent.click(linkButton);
    const textArea = queryAllByRole(form, 'textbox');
    
    expect(textArea[1]).toBeInTheDocument();
    expect(textArea[1].placeholder).toEqual('Url');
    expect(textArea[1]).toHaveProperty('required', true);
  });

  test('Pressing on "choose a community" shows drop down', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );

    const dropDown = screen.getByTestId('subreddits-dropdown');
    const button = screen.getByText('Choose a community');

    expect(dropDown).toHaveStyle('display: none');

    userEvent.click(button);

    expect(dropDown).toHaveStyle('display: flex');
  });

  test('Choosing a subreddit displays its icon and name', async () => {

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

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PostCreator />
        </BrowserRouter>
      </Provider>
    );

    const dropDown = screen.getByTestId('subreddits-dropdown');
    const button = screen.getByRole('button', { name: 'Choose a community'});
    userEvent.click(button);

    const subreditLink = getByRole(dropDown, 'img');
    userEvent.click(subreditLink);

    const buttonTitle = screen.getByTestId('community-chooser-title');

    expect(buttonTitle).toHaveTextContent('aww');
  });
})