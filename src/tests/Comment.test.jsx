import React from 'react';
import { render, screen, container, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../components/post/Comment';

jest.mock('..//firebase/firebase');

describe('Comment', () => {
  test('Display basic comment data', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
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

  test('Display nested comments', async () => {
    const mockComment = {
      timePosted: new Date().toString(),
      content: 'mockContent',
      user: 'mockUser',
      upVotes: 10,
      responses: [{
        timePosted: new Date().toString(),
        content: 'anotherMockContent',
        user: 'anotherMockUser',
        upVotes: 1,
      }],
    };

    await act(async () => render(<Comment comment={mockComment} />));

    const comments = screen.queryAllByTestId('comment');
    
    expect(comments[1]).toHaveStyle('margin-left: 15px');
  });
});
