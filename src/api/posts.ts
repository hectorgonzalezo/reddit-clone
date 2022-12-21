import BASEURL from './baseurl';
import uploadImage from './uploadImage';

export async function getPost(postId: string): Promise<{
  post: IPost;
  errors?: BackendErrors;
}> {
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
  increase: number,
  token: string,
): Promise<{ user: IUser; post: IPost }> {
  const response = await fetch(`${BASEURL}/users/${userId}/vote/${postId}`, {
    method: "PUT",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ vote: voteType, increase }),
  });
  const updated = await response.json();
  return updated;
}

export async function getAllPosts(): Promise<{
  posts: IPost[];
  errors?: BackendErrors;
}> {
  const response = await fetch(`${BASEURL}/posts`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const posts = await response.json();
  return posts;
}

export async function getPostsInSubreddit(
  subredditId: string
): Promise<{ posts: IPost[]; errors?: BackendErrors }> {
  const response = await fetch(`${BASEURL}/posts/?community=${subredditId}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const posts = await response.json();
  return posts;
}

export async function getPostsByUSer(
  userId: string
): Promise<{ posts: IPost[]; errors?: BackendErrors }> {
  const response = await fetch(`${BASEURL}/posts/?user=${userId}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const posts = await response.json();
  return posts;
}


// Both create posts return the post id
  // adds a post in the specified subreddit
  export async function createPost(
    post: { title: string; community: string; text?: string, url?: string},
    token: string
  ): Promise<IPost> {
    const response = await fetch(`${BASEURL}/posts`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();

    return data.post;
  }

  export async function createImagePost(
    post: { title: string; community: string },
    user: IUser,
    image: File,
  ): Promise<IPost> {
    const url = await uploadImage(image, `postImages/${user._id as string}/images`);

    const { title, community } = post;
    const response = await fetch(`${BASEURL}/posts`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ title, community, url }),
    });

    const data = await response.json();

    return data.post;
  }