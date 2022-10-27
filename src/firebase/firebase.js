// Saves a new message to Cloud Firestore.
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  setDoc,
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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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

  // Links user authorization with user name
  async function addUser(email, username) {
    const docRef = await setDoc(doc(db, 'users', username), {
      email,
      username,
      icon: 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1',
    });
  }

  async function getUser(username) {
    const user = [];
    const userQuery = query(collection(db, 'users'), where('username', '==', username));
    const userDoc = await getDocs(userQuery);
    userDoc.forEach((data) => user.push(data.data()));
    return user[0];
  }

  async function saveUserIcon(file, username) {
    try {
      // Upload the image to Cloud Storage.
      const filePath = `${username}/icon/${file.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);
      // Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);
      // update user's icon
      const userDoc = doc(db, 'users', username);
      await updateDoc(userDoc, {
        icon: publicImageUrl,
      });
      return publicImageUrl;
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    }
  }

  return {
    getSubredditsData,
    getAllPostsInSubreddit,
    getTopPostsInSubreddit,
    addUser,
    getUser,
    saveUserIcon,
  };
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

  const createAccount = async (loginEmail, loginPassword, username) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    // If sucessfully created account, link it with username in database
    database.addUser(userCredential.user.email, username);
    return userCredential.user;
  };

  const logIn = async (username, loginPassword) => {
    const login = await database.getUser(username);
    const loginEmail = login.email;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword,
    );
    return userCredential.user;
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
    logIn,
    loginEmailPassword,
    createAccount,
  };
})();

export { database, authorization };
