import BASEURL from './baseurl';

export async function getUser(userId: string): Promise<IUser> {
  const response = await fetch(`${BASEURL}/users/${userId}`, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  });

  const fetchedUser = await response.json();

  return fetchedUser;
}

export async function signUp(user: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): Promise<IUser> {
  const response = await fetch(`${BASEURL}/users/sign-up`, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const createdUser = await response.json();

  return createdUser;
};

export async function logIn(user: {
  username: string;
  password: string;
}): Promise<IUser> {
  const response = await fetch(`${BASEURL}/users/log-in`, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const createdUser = await response.json();

  return createdUser;
};



export async function saveUserIcon(file, username) {
    try {
      const publicImageUrl = await uploadImage(file, `users/${username}/icon`);
      // update user's icon
      const userDoc = doc(db, 'users', username);
      await updateDoc(userDoc, {
        icon: publicImageUrl,
      });
      return publicImageUrl;
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
      return error;
    }
  }

export async function editSubscription(subreddit, username, callback, userIncrement) {
    const subredditDoc = doc(db, 'subreddits', subreddit);
    const userDoc = doc(db, 'users', username);

    await updateDoc(subredditDoc, {
      members: increment(userIncrement),
    });

    await updateDoc(userDoc, { subreddits: callback(subreddit) });
  }

export async function subscribeToSubreddit(subreddit, username) {
    await editSubscription(subreddit, username, arrayUnion, 1);
  }

export async function unsubscribeFromSubreddit(subreddit, username) {
    await editSubscription(subreddit, username, arrayRemove, -1);
  }
