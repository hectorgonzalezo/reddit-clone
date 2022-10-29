import React from 'react';
import { render, screen, container } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PostPreview from '../components/PostPreview';
import { Provider } from 'react-redux';
import store from '../store/store';

describe('Post previews', () => {
  const mockPost = {
    subredditName: 'aww',
    subredditIcon: undefined,
    poster: 'yo',
    title: 'Title',
    text: 'Hey!',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/postImages%2Fbar%2Fimages58b82c35dcf6e61433da9494.png?alt=media&token=c77db72a-07d3-4c61-9a2c-cfc86e8e4bb1',
    postId: '0',
    upVotes: 2300,
    timePosted: (new Date()).toString(),
    comments: [{}],
  };

  test('Render title and basic info', () => {
    // get values from mockPost
    const {
      subredditName,
      subredditIcon,
      poster,
      title,
      upVotes,
      timePosted,
      comments,
      postId,
    } = mockPost;

    // render mock post preview
    render(
    <Provider store={store}>
      <PostPreview
        key={title}
        subredditName={subredditName}
        subredditIcon={subredditIcon}
        poster={poster}
        timePosted={timePosted}
        title={title}
        postId={postId}
        upVotes={upVotes}
        comments={comments}
      />
    </Provider>);

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

  test('Render text if given one', () => {
    // get values from mockPost
    const {
      subredditName,
      subredditIcon,
      poster,
      title,
      text,
      upVotes,
      timePosted,
      comments,
      postId,
    } = mockPost;

    // render mock post preview
    render(
      <Provider store={store}>
        <PostPreview
          key={title}
          subredditName={subredditName}
          subredditIcon={subredditIcon}
          poster={poster}
          timePosted={timePosted}
          title={title}
          text={text}
          postId={postId}
          upVotes={upVotes}
          comments={comments}
        />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();

    const textContent = screen.getByText('Hey!');
    expect(textContent).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('Given an imageUrl display it', () => {
    // get values from mockPost
    const {
      subredditName,
      subredditIcon,
      poster,
      title,
      imageUrl,
      upVotes,
      postId,
      timePosted,
      comments,
    } = mockPost;

    // render mock post preview
    render(
      <Provider store={store}>
        <PostPreview
          key={title}
          subredditName={subredditName}
          subredditIcon={subredditIcon}
          poster={poster}
          timePosted={timePosted}
          title={title}
          img={imageUrl}
          postId={postId}
          upVotes={upVotes}
          comments={comments}
        />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();

    const imageContent = screen.getByTestId('image-content');
    expect(imageContent).toBeInTheDocument();
    expect(imageContent).toHaveAttribute('src', mockPost.imageUrl);

    expect(container).toMatchSnapshot();
  });

  test.skip('Pressing upvote and downvote buttons disabled if no user is logged in', () => {
  });
  test.skip('Pressing upvote updates number and changes icon color', () => {
  });
  test.skip('Pressing downvote updates number and changes icon color', () => {
  });
  test.skip('Pressing upvote twice removes previous vote', () => {
  });
  test.skip('Pressing downvote twice removes previous vote', () => {
  });
  test.skip('Pressing upvote and then downvote leaves only downvote', () => {
  });
})