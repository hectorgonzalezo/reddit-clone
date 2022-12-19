import BASEURL from './baseurl';

const icon = 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1';
const mockSubreddit = {
  name: 'aww',
  dateCreated: (new Date()).toString(),
  description:
      'Things that make you go AWW! Like puppies, bunnies, babies, and so on... A place for really cute pictures and videos!',
  icon,
  members: 0,
  postQuantity: 3,
  subtitle: 'A subreddit for cute and cuddly pictures',
};


export async function getSubreddit(
  subredditId: string
): Promise<any> {
  const subreddit = await Promise.resolve(mockSubreddit);
  return { community: subreddit};
}
