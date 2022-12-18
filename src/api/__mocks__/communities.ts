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

// export async function getSubreddits(): Promise<ICommunity[]> {
//   const response = await fetch(`${BASEURL}/communities`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     mode: "cors",
//   });
//   const subreddits = await response.json();

//   return subreddits;
// }

export async function getSubreddit(
  subredditId: string
): Promise<ICommunity> {
  const subreddit = await Promise.resolve(mockSubreddit);
  return subreddit;
}

// export async function createSubreddit(
//   subreddit: {
//     name: string;
//     subtitle: string;
//     description: string;
//     icon?: File;
//   },
//   token: string
// ): Promise<ICommunity> {
//   // upload file first!
//   // todo
//   const { name, subtitle, description, icon } = subreddit;
//   const response = await fetch(`${BASEURL}/communities`, {
//     method: "POST",
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(subreddit),
//   });
//   const createdSubreddit = await response.json();

//   return createdSubreddit;
// } 