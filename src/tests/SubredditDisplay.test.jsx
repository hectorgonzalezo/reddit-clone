import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SubredditDisplay from '../components/subreddit/SubredditDisplay';
import store from '../store/store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    name: 'aww',
  }),
}));

const mockSubreddit ={
  name: 'aww',
  dateCreated: (new Date()).toString(),
  description:
      'Things that make you go AWW! Like puppies, bunnies, babies, and so on... A place for really cute pictures and videos!',
  icon: 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/subredditIcons%2Faww_icon.jpeg?alt=media&token=2e8d3f04-c62e-44a2-86e9-daf26d307afc',
  members: 0,
  postQuantity: 3,
  subtitle: 'A subreddit for cute and cuddly pictures',
};

const { name, dateCreated, description, icon, members, postQuantity, subtitle } = mockSubreddit;

describe('Subreddit display', () => {
  test('Render subreddit info', async () => {
    await act(async () => {
      store.dispatch({
        type: 'subreddits/addSubreddit',
        payload: [mockSubreddit],
      });
    });

    // render mock post preview
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SubredditDisplay />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(`r/${name}`)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByTestId('members-num')).toHaveTextContent(members);
    expect(container).toMatchSnapshot();
  });
});
