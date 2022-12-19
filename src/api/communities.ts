import BASEURL from './baseurl';
import uploadImage from './uploadImage';

export async function getSubreddits(): Promise<{
  communities: ICommunity[];
  errors?: BackendErrors;
}> {
  const response = await fetch(`${BASEURL}/communities`, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  });
  const subreddits = await response.json();

  return subreddits;
}

export async function getSubreddit(
  subredditId: string
): Promise<{
  community: ICommunity;
  errors?: BackendErrors;
}> {
  const response = await fetch(`${BASEURL}/communities/${subredditId}`, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  });
  const subreddit = await response.json();

  return subreddit;
}

export async function createSubreddit(
  subreddit: {
    name: string;
    subtitle: string;
    description: string;
    icon?: File | string;
  },
  token: string
): Promise<{
  community: ICommunity;
  errors?: BackendErrors;
}> {
  const community = { ...subreddit};
  // upload icon if there's one
  if (community.icon !== undefined && typeof community.icon !== 'string') {
    const iconUrl = await uploadImage(community.icon, 'comunityIcons/');
    // add the url to community object
    community.icon = iconUrl;
  }
  const response = await fetch(`${BASEURL}/communities`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(community),
  });
  const createdSubreddit = await response.json();

  return createdSubreddit;

} ;