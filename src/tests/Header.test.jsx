import React from 'react';
import { render, screen, container, act, getByRole, getAllByRole } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import Header from '../components/Header';
import store from '../store/store';

jest.mock('../firebase/firebase');

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';

describe('Sign up modal', () => {
  test('User area should display log in and sign up buttons by default', () => {
    render(<Provider store={store}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
     </Provider>);

    const userArea = screen.queryByTestId('user-area');
    expect(userArea.children.length).toBe(2);

    const logInButton = screen.getByRole('button', { name: 'Log In' });
    expect(logInButton).toBeInTheDocument();
    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
    expect(signUpButton).toBeInTheDocument();
    
    expect(container).toMatchSnapshot();
  });

  test('Log in and sign up button call function that opens their modals', () => {
    const mockLogInFunc = jest.fn();
    const mockSignUpFunc = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header logInFunc={mockLogInFunc} signUpFunc={mockSignUpFunc} />
        </BrowserRouter>
      </Provider>
    );

    const logInButton = screen.getByRole('button', { name: 'Log In' });
    userEvent.click(logInButton);

    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
    userEvent.click(signUpButton);

    expect(mockLogInFunc).toBeCalled();
    expect(mockSignUpFunc).toBeCalled();
  });

  test('If given a user, user area should contain a single button with the user info', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: []},
      });
    });

    // User name and icon should be displayed
    expect(screen.getByText('juan')).toBeInTheDocument();
    expect(screen.getByAltText('user icon')).toBeInTheDocument();

  });

  test('If given a user, drop down menu should be invisible and shown only when clicking', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: []},
      });
    });

    const userArea = screen.queryByTestId('user-area');

    // drop down shoul be invisible
    const dropDown = screen.getByTestId('user-dropdown');
    expect(dropDown).toHaveStyle('display: none');

    // User name and icon should be displayed
    const userButton = getByRole(userArea, 'button');
    userEvent.click(userButton);

    expect(dropDown).not.toHaveStyle('display: none');
  });

  test('Pressing logout on user dropdown logs user out', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

    const userArea = screen.queryByTestId('user-area');

    const dropDown = screen.getByTestId('user-dropdown');
    expect(dropDown).toHaveStyle('display: none');

    const userButton = getByRole(userArea, 'button');
    userEvent.click(userButton);

    const logOutLink = screen.getByTestId('logout-link');

    await act(async () => userEvent.click(logOutLink));


    // there should be no user information
    expect(screen.queryByText('juan')).not.toBeInTheDocument();
    expect(screen.queryByAltText('user icon')).not.toBeInTheDocument();
  });

  test('If given a user, there should be a go to bar', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // It shouldn't be there by default
    expect(screen.queryByTestId('go-to')).not.toBeInTheDocument()

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

    expect(screen.queryByTestId('go-to')).toBeInTheDocument()

  });

  test('Pressing on go to button shows subreddits dropdown', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    // It shouldn't be there by default

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

    const goToArea = screen.getByTestId('go-to')
    const goToButton = getByRole(goToArea, 'button');
    const dropDown = screen.getByTestId('subreddits-dropdown');

    expect(dropDown).toHaveStyle('display: none');

    userEvent.click(goToButton);

    expect(dropDown).not.toHaveStyle('display: none');
  });

  test('Selecting a subreddit shows its name and icon in go to bar', async () => {
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

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon, subreddits: [] },
      });
    });

    await act(async () => {
      store.dispatch({
        type: "subreddits/addSubreddit",
        payload: [mockSubreddit],
      });
    });

    await act(async () => {
      store.dispatch({
        type: "currentSubreddit/changeCurrentSubreddit",
        payload: 'aww',
      });
    });

    await act(async () => {
      render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    )
    });

    // It shouldn't be there by default

    const goToArea = screen.getByTestId('go-to')
    const goToButton = getByRole(goToArea, 'button');
    const subredditName = getByRole(goToButton, 'heading');
    const subredditIcon = getByRole(goToButton, 'img');

    expect(subredditName).toHaveTextContent('aww');
    expect(subredditIcon).toHaveAttribute('src', icon);
  });
});