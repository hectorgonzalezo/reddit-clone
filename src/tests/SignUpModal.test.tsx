import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SignUpModal from '../components/SignUpModal';
import { Provider } from 'react-redux';
import store from '../store/store';

jest.mock('../api/users');

describe('Sign up modal', () => {
  test('Renders with sign up button disabled', () => {
    render(<Provider store={store}>
      <SignUpModal />
     </Provider>);
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', true);

    expect(container).toMatchSnapshot();
  });

  test('After filling form correctly, button gets enabled', () => {
    render(<Provider store={store}>
      <SignUpModal />
     </Provider>);
    const textInputs = screen.queryAllByRole('textbox');
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], 'mockUser');
    userEvent.type(textInputs[1], 'mock@mock.com');
    passwordInputs.forEach((input) => userEvent.type(input, 'password'));

    // Button should be enabled
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).not.toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', false);

    expect(container).toMatchSnapshot();
  });

  test('Button doesnt get enabled if mail is missing @', () => {
    render(<Provider store={store}>
      <SignUpModal />
     </Provider>);
    const textInputs = screen.queryAllByRole('textbox');
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], 'mockUser');
    userEvent.type(textInputs[1], 'mock');
    passwordInputs.forEach((input) => userEvent.type(input, 'password'));

    // Button should be enabled
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', true);

    expect(container).toMatchSnapshot();
  });
  test('Button doesnt get enabled if mail is missing top-level domain name', () => {
    render(<Provider store={store}>
      <SignUpModal />
     </Provider>);
    const textInputs = screen.queryAllByRole('textbox');
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], 'mockUser');
    userEvent.type(textInputs[1], 'mock@user');
    passwordInputs.forEach((input) => userEvent.type(input, 'password'));

    // Button should be enabled
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', true);

    expect(container).toMatchSnapshot();
  });

  test('Button doesnt get enabled if passwords are different', () => {
    render(<Provider store={store}>
      <SignUpModal />
     </Provider>);
    const textInputs = screen.queryAllByRole('textbox');
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], 'mockUser');
    userEvent.type(textInputs[1], 'mock@mock.com');
    passwordInputs.forEach((input) => userEvent.type(input, `password${Math.random()}`));

    // Button should be enabled
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', true);

    expect(container).toMatchSnapshot();
  });

  test('Button gets disabled when passwords are changed and dont match', () => {
    render(<Provider store={store}>
      <SignUpModal />
     </Provider>);
    const textInputs = screen.queryAllByRole('textbox');
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], 'mockUser');
    userEvent.type(textInputs[1], 'mock@mock.com');
    passwordInputs.forEach((input) => userEvent.type(input, 'password'));
    userEvent.type(passwordInputs[0], '{backspace}2');

    // Button should be enabled
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', true);

    expect(container).toMatchSnapshot();
  });

  test("Filling the form correctly and pressing the button calls close function", async () => {
    const mockCloseFunc = jest.fn();
    render(
      <Provider store={store}>
        <SignUpModal closeFunc={mockCloseFunc} />
      </Provider>
    );
    const textInputs = screen.queryAllByRole("textbox");
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], "mockUser");
    userEvent.type(textInputs[1], "mock@mock.com");
    passwordInputs.forEach((input) => userEvent.type(input, "password"));
    // Press button
    const button = screen.getByRole("button", { name: "Sign Up" });
    await act(async () => {
      userEvent.click(button);
    });

    expect(mockCloseFunc).toBeCalled();
  });

  test('Pressing sign up button shows loading gif', async () => {
    render(
      <Provider store={store}>
        <SignUpModal />
      </Provider>
    );
    const textInputs = screen.queryAllByRole('textbox');
    const passwordInputs = screen.queryAllByLabelText(/password/i);

    // Fill in form
    userEvent.type(textInputs[0], 'mockUser');
    userEvent.type(textInputs[1], 'mock@mock.com');
    passwordInputs.forEach((input) => userEvent.type(input, 'password'));

    const button = screen.getByRole('button', { name: 'Sign Up' });

    await act(async () => userEvent.click(button));

    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});