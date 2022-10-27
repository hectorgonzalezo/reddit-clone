import React from 'react';
import { render, screen, container, act, getByRole, queryByRole } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import Header from '../components/Header';
import store from '../store/store';

jest.mock('../firebase/firebase');

describe('Sign up modal', () => {
  test('User area should display log in and sign up buttons by default', () => {
    render(<Provider store={store}>
      <Header />
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
        <Header logInFunc={mockLogInFunc} signUpFunc={mockSignUpFunc} />
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
    const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    // User name and icon should be displayed
    expect(screen.getByText('juan')).toBeInTheDocument();
    expect(screen.getByAltText('user icon')).toBeInTheDocument();

  });
  test('If given a user, user area should contain a single button with the user info', async () => {
    const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
      });
    });

    

    // User name and icon should be displayed
    expect(screen.getByText('juan')).toBeInTheDocument();
    expect(screen.getByAltText('user icon')).toBeInTheDocument();

  });

  test('If given a user, drop down menu should be invisible and shown only when clicking', async () => {
    const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
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
    const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    await act(async () => {
      store.dispatch({
        type: "user/addUser",
        payload: { username: "juan", email: "mock@mock.com", icon },
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
});