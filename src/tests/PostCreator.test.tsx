import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, container, act, getByRole, queryAllByRole } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import store from '../store/store';
import PostCreator from '../components/post/PostCreator';

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
describe('Post creator page', () => {
  test('Post starts highlighted', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

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
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });
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
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });
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
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

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
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

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
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
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
    const button = screen.getByText('Choose a community');

    expect(dropDown).toHaveStyle('display: none');

    userEvent.click(button);

    expect(dropDown).toHaveStyle('display: flex');
  });

  test('Choosing a subreddit displays its icon and name', async () => {
    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: ['aww'] },
      });
    });

    await act(async () => {
      store.dispatch({
        type: "subreddits/addSubreddit",
        payload: [
          {
            name: "aww",
            icon: "https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/aww_icon.jpeg?alt=media&token=b6bc425f-f335-4b73-8c36-df3df45bacd6",
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