/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';
import { database, authorization } from '../firebase/firebase';

describe('Comunication with database', () => {
  test('Gets all subreddit names', async () => {
    const subredditsData = await database.getSubredditsData();
    expect(typeof subredditsData).toBe('object');
    expect(subredditsData.length).not.toBe(0);
  });

  test('Fetches all posts from subreddit', async () => {
    const posts = await database.getAllPostsInSubreddit('aww');
    expect(posts.length).not.toBe(0);
    expect(typeof (posts[0])).toBe('object');
  });
});

describe('User authorization', () => {
  test('Connects to an existing user', async () => {
    const existingUserLogin = await authorization.loginEmailPassword('mock_email@mock.com', 'mockpassword');
    expect(existingUserLogin.email).toBe('mock_email@mock.com');
  });
  test('Trows an error when trying to find fake user', async () => {
    const fakeUserLogin = await authorization.loginEmailPassword('mock_email@mock.comq', 'mockpasswordq');
    expect(fakeUserLogin.email).not.toBe('mock_email@mock.comq');
  });
});