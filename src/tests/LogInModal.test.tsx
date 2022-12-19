import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import LogInModal from '../components/LogInModal';
import store from '../store/store';

jest.mock('../api/users');

describe('Styled button works', () => {
  test('Filling in with fake data shows error message', async () => {
    render(<Provider store={store}>
            <LogInModal />
           </Provider>
    );
    const textInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button', { name: 'Log In' });

    userEvent.type(textInput, 'fakefake');
    userEvent.type(passwordInput, 'fakefake');
    await act(async () => userEvent.click(button));

    expect(screen.getByText('Incorrect username or password')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('Pressing log in button shows loading gif', async () => {
    render(<Provider store={store}>
      <LogInModal />
     </Provider>
    );
    const textInput = screen.getByRole('textbox');
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button', { name: 'Log In' });

    userEvent.type(textInput, 'truetrue');
    userEvent.type(passwordInput, 'truetrue');
    await act(async() => userEvent.click(button));

    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});