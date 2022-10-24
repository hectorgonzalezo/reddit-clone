import React from 'react';
import { render, screen, container } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PostPreview from '../components/PostPreview';

describe('Post previews', () => {
  const mockPost = {
    subredditName: 'aww',
    subredditIcon: undefined,
    poster: 'yo',
    title: 'Title',
    upVotes: 2300,
    timePosted: (new Date()).toString(),
    comments: [{}],
  };

  test('Render title', () => {
    // get values from mockPost
    const {
      subredditName,
      subredditIcon,
      poster,
      title,
      upVotes,
      timePosted,
      comments,
    } = mockPost;

    // render mock post preview
    render(<PostPreview
      key={title}
      subredditName={subredditName}
      subredditIcon={subredditIcon}
      poster={poster}
      timePosted={timePosted}
      title={title}
      upVotes={upVotes}
      comments={comments}
    />);

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();

    const paragraphs = screen.queryByRole('paragraph');
    // console.log(paragraphs)
    expect(screen.getByRole('link', { name: `u/${poster}` })).toBeInTheDocument();
    expect(screen.getByText('2.3k')).toBeInTheDocument();
    expect(screen.getByText(`r/${subredditName}`)).toBeInTheDocument();
    expect(screen.getByText(`u/${poster}`)).toBeInTheDocument();
    expect(screen.getByText('1 Comments')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
})