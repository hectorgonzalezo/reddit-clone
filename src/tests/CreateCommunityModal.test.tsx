import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CreateCommunityModal from '../components/subreddit/CreateCommunityModal';

import store from '../store/store';

jest.mock('../api/users');

describe('Styled button works', () => {
  test('Create community button should be disabled by default', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CreateCommunityModal />
        </BrowserRouter>
      </Provider>
    );
    const createButton = screen.getByRole('button', { name: 'Create Community'});

    expect(createButton).toBeDisabled();
  });

  test('Filling inputs enables the button', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CreateCommunityModal />
        </BrowserRouter>
      </Provider>
    );
    const createButton = screen.getByRole('button', { name: 'Create Community'});

    const textInputs = screen.getAllByRole('textbox');

    textInputs.forEach((input) => userEvent.type(input, 'mockcontent'))
    expect(createButton).not.toBeDisabled();
  });
});