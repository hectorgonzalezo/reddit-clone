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

const user = { username: 'juan', subreddits: [] };

const database = (() => {
  const getUser = async (username) => {
    const userCredential = await Promise.resolve({ user: username, icon: 'icon' });
    if (username === 'fakefake') {
      throw 'Fake username';
    }
    return user;
  };

  const updateVotes = async (username, subredditName, postId, increment, voteType) => {
  };

  const addComment = jest.fn();

  const getSubredditData = async (subredditName) => {
    const subreddit = await Promise.resolve(mockSubreddit);
    return subreddit;
  };

  async function subscribeToSubreddit(subreddit, username) {
    user.subreddits.push('aww');
    return Promise.resolve();
  }

  async function unsubscribeFromSubreddit(subreddit, username) {
    user.subreddits = [];
    return Promise.resolve();
  }

  return {
    getUser,
    updateVotes,
    addComment,
    getSubredditData,
    subscribeToSubreddit,
    unsubscribeFromSubreddit,
  };
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
