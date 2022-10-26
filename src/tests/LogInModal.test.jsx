
import React from 'react';
import { render, screen, container } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LogInModal from '../components/LogInModal';

describe('Styled button works', () => {
  test.only('Filling in with fake data shows error message', () => {
    render(<LogInModal />);
    const textInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button', { name: 'Log In' });

    userEvent.type(textInput, 'fakefake');
    userEvent.type(passwordInput, 'fakefake');
    userEvent.click(button);

    expect(screen.getByText('Incorrect username or password' )).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('After filling form correctly, button gets enabled', () => {
    render(<LogInModal />);
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
    render(<LogInModal />);
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
    render(<LogInModal />);
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
    render(<LogInModal />);
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
    render(<LogInModal />);
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
});