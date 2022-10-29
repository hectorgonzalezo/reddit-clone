
const database = (() => {

  const getUser = async (username) => {
    const userCredential = await Promise.resolve({ user: username });
    if (username === 'fakefake') {
      throw 'Fake username';
    }
    return userCredential.user;
  };

  return { getUser };
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
