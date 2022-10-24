/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';
import database from '../firebase/firebase';

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
