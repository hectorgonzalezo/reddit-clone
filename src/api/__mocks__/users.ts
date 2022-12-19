import BASEURL from './baseurl';
import uploadImage from './uploadImage';


let mockUser: { username: string; subreddits: string[] } = {
  username: "juan",
  subreddits: [],
};

const mockUserData ={
  user: {
    username: "juan",
    email: "mock@mock.com",
    _id: "123456789a123456789b1234",
  },
  token: "123456789012345678901234",
};

export async function getUser(userId: string): Promise<any> {
  const userCredential = await Promise.resolve(mockUser);
  // if (username === 'fakefake') {
  //   throw 'Fake username';
  // }
  return userCredential;
}

export async function signUp(user: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): Promise<any> {
  mockUserData.user = {
    username: "juan",
    email: "mock@mock.com",
    _id: "123456789a123456789b1234",
  };

  const userCredential = await Promise.resolve(mockUserData);
  return userCredential;
};

export async function logIn(user: {
  username: string;
  password: string;
}): Promise<any> {
  const userCredential = await Promise.resolve({ user: mockUserData });
  if (user.username === 'fakefake') {
    throw 'Fake username';
  }
  return userCredential.user;
};


export async function subscribeToSubreddit(
  subredditId: string,
  user: IUser
): Promise<void> {
  mockUser.subreddits.push('aww');
  return Promise.resolve();
}

export async function unsubscribeFromSubreddit(
  subredditId: string,
  user: IUser
): Promise<void> {
  mockUser = { username: 'juan', subreddits: [] };
  return Promise.resolve();
}
