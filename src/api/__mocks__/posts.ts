import BASEURL from './baseurl';
import uploadImage from './uploadImage';

export async function getPost(postId: string): Promise<IPost> {
  const response = await fetch(`${BASEURL}/posts/${postId}`, {
    method: "GET",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    }});
    const post = await response.json();
    return post;
}


export async function vote(
  userId: string,
  postId: string,
  voteType: Vote,
  token: string,
): Promise<any> {
  return await Promise.resolve({
    user: { _id: "2345", username: "juan", icon: "http://fake.com/fake" },
    post: { _id: "1234" },
  });
}

export async function getPostsInSubreddit(subredditId: string): Promise<IPost[]> {
  const response = await fetch(`${BASEURL}/posts/?community=${subredditId}`, {
    method: "GET",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    }});
    const posts = await response.json();
    return posts;
}


// Both create posts return the post id
  // adds a post in the specified subreddit
  export async function createPost(
    post: { title: string; community: string; text?: string, url?: string},
    token: string
  ): Promise<string> {
    const response = await fetch(`${BASEURL}/posts}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();

    return data.post._id;
  }

  export async function createImagePost(
    post: { title: string; community: string },
    user: IUser,
    image: File,
  ): Promise<string> {
    const imageUrl = await uploadImage(image, `postImages/${user._id as string}/images`);

    const { title, community } = post;
    const response = await fetch(`${BASEURL}/posts}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ title, community, imageUrl }),
    });

    const data = await response.json();

    return data.post._id;
  }