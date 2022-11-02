const database = (() => {
  const getUser = async (username) => {
    const userCredential = await Promise.resolve({ user: username, icon: 'icon' });
    if (username === 'fakefake') {
      throw 'Fake username';
    }
    return userCredential.user;
  };

  const updateVotes = async (username, subredditName, postId, increment, voteType) => {
  };

  const addComment = jest.fn();
  return { getUser, updateVotes, addComment };
})();

// Used for user sign in and sign up
const authorization = (() => {
  const createAccount = async (loginEmail, loginPassword, username) => {
    const userCredential = await Promise.resolve({ user: username })
    return userCredential.user;
  };

  const logIn = async (username, loginPassword) => {
    const userCredential = await Promise.resolve({ user: username });
    if (username === 'fakefake') {
      throw 'Fake username';
    }
    return userCredential.user;
  };
  const getUser = async (username, loginPassword) => {
    const userCredential = await Promise.resolve({ user: username });
    if (username === 'fakefake') {
      throw 'Fake username';
    }
    return userCredential.user;
  };

  const logOut = () => true;

  return { logIn, logOut, getUser, createAccount };
})();

export { database, authorization };
