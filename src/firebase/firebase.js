// Saves a new message to Cloud Firestore.
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  connectAuthEmulator,
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';

const firebaseApp = initializeApp(getFirebaseConfig());

const database = (() => {
  const db = getFirestore(firebaseApp);
  async function getSubredditsData() {
    const names = [];
    const subreddits = await getDocs(query(collection(db, 'subreddits')));

    subreddits.forEach((subreddit) =>
      names.push({ name: subreddit.data().name, icon: subreddit.data().icon })
    );

    return names;
  }

  async function getAllPostsInSubreddit(subredditName) {
    const posts = [];
    const postsQuery = query(
      collection(db, `subreddits/${subredditName}/posts`),
      orderBy('timePosted', 'desc'),
      limit(10)
    );
    const postsInSubreddit = await getDocs(postsQuery);
    postsInSubreddit.forEach((post) => posts.push(post.data()));

    return posts;
  }

  async function getTopPostsInSubreddit(subredditName) {
    const posts = [];
    const postsInSubreddit = await getDocs(
      query(collection(db, `subreddits/${subredditName}/posts`))
    );
    postsInSubreddit.forEach((post) => posts.push(post.data()));

    return posts;
  }

  return { getSubredditsData, getAllPostsInSubreddit, getTopPostsInSubreddit };
})();

// Used for user sign in and sign up
const authorization = (() => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;
  // const emulator = connectAuthEmulator(auth, 'http://localhost:9099');
  let emulator;

  const loginEmailPassword = async (loginEmail, loginPassword) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      return userCredential.user;
    } catch (error) {
      return error;
    }
  };

  const createAccount = async (loginEmail, loginPassword) => {
    try {
      console.log({ auth });
      console.log({ loginEmail, loginPassword });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(userCredential);
      return userCredential.user;
    } catch (error) {
      console.log('error');
      return error;
    }
  };

  const logInPopup = async () => {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new GoogleAuthProvider();
    // const provider = new EmailAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return {
    auth,
    user,
    emulator,
    logInPopup,
    loginEmailPassword,
    createAccount,
  };
})();

export { database, authorization };
