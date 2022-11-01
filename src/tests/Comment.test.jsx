import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../components/post/Comment';
jest.mock('..//firebase/firebase');

describe('Comment', () => {
  test('Display basic comment data', async () => {
    const mockComment = {
      timePosted: (new Date()).toString(),
      content: 'mockContent',
      user: 'mockUser',
      upVotes: 10,
    };

    await act(async () => render(<Comment comment={mockComment} />));

    expect(screen.getByText('mockContent')).toBeInTheDocument();
    expect(screen.getByText('mockUser')).toBeInTheDocument();
    expect(screen.getByText(/less/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
