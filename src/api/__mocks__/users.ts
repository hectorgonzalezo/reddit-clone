import BASEURL from './baseurl';
import uploadImage from './uploadImage';

interface MockUser {
username: string;
subreddits: string[];
}

let mockUser = { username: 'juan', subreddits: [] };

export async function getUser(userId: string): Promise<IUser> {
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

// export async function logIn(user: {
//   username: string;
//   password: string;
// }): Promise<IUser> {
//   const response = await fetch(`${BASEURL}/users/log-in`, {
//     method: "POST",
//     mode: "cors",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(user),
//   });

//   const createdUser = await response.json();

//   return createdUser;
// };


// export async function saveUserIcon(file: File, user: IUser): Promise<string> {
//     try {
//       // host image
//       const icon = await uploadImage(file, `users/${user._id as string}/icon`);

//       // update user's icon with url
//       const response = await fetch(`${BASEURL}/users/${user._id as string}`, {
//         method: "PUT",
//         mode: "cors",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({ icon }),
//       });

//       const returnedUser = await response.json();
//       return returnedUser.user;
//     } catch (error) {
//       console.error('There was an error uploading a file to Cloud Storage:', error);
//       throw error;
//     }
//   }

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
