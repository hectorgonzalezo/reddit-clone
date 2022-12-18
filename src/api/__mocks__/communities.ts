import BASEURL from './baseurl';

export async function getSubreddits(): Promise<ICommunity[]> {
  const response = await fetch(`${BASEURL}/communities`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
  });
  const subreddits = await response.json();

  return subreddits;
}

export async function getSubreddit(
  subredditId: string
): Promise<ICommunity> {
  const response = await fetch(`${BASEURL}/communities/${subredditId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
  });
  const subreddit = await response.json();

  return subreddit;
}

export async function createSubreddit(
  subreddit: {
    name: string;
    subtitle: string;
    description: string;
    icon?: File;
  },
  token: string
): Promise<ICommunity> {
  // upload file first!
  // todo
  const { name, subtitle, description, icon } = subreddit;
  const response = await fetch(`${BASEURL}/communities`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subreddit),
  });
  const createdSubreddit = await response.json();

  return createdSubreddit;
} 