
import React from 'react';
import { render, screen, container } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SignUpModal from '../components/SignUpModal';

describe('Styled button works', () => {
  test('Renders with sign up button disabled', () => {
    render(<SignUpModal />);
    const button = screen.getByRole('button', { name: 'Sign Up' });
    expect(button).toHaveStyle('opacity: 0.5');
    expect(button).toHaveProperty('disabled', true);

    expect(container).toMatchSnapshot();
  });

  test('After filling form correctly, button gets enabled', () => {
    render(<SignUpModal />);
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
    render(<SignUpModal />);
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

  test('Button doesnt get enabled if passwords are different', () => {
    render(<SignUpModal />);
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
    render(<SignUpModal />);
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