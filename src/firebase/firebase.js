// Saves a new message to Cloud Firestore.
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  increment,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove
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
  updateCurrentUser,
} from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';

const firebaseApp = initializeApp(getFirebaseConfig());

const database = (() => {
  const db = getFirestore(firebaseApp);

  // uploads an image to firestore
  // arguments are the file to upload and the path to upload it to
  async function uploadImage(file, path) {
    try {
      // Upload the image to Cloud Storage.
      const filePath = `${path}${file.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);
      // Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);
      return publicImageUrl;
    } catch (error) {
      console.log(`couldn't upload ${file.name}`);
      return error;
    }
  }
  async function getSubredditsData() {
    const names = [];
    const subreddits = await getDocs(query(collection(db, 'subreddits')));

    subreddits.forEach(async (subreddit) => {
      names.push(subreddit.data());
    }
    );

    return names;
  }

  async function getSubredditData(subredditName) {
    const userDoc = await getDoc(doc(db, 'subreddits', subredditName));
    return userDoc.data();
  }

  async function getAllPostsInSubreddit(subredditName) {
    const posts = [];
    const postsQuery = query(
      collection(db, `subreddits/${subredditName}/posts`),
      orderBy('timePosted', 'desc'),
      limit(10),
    );
    const postsInSubreddit = await getDocs(postsQuery);
    postsInSubreddit.forEach((post) => posts.push(post.data()));

    return posts;
  }

  async function getTopPostsInSubreddit(subredditName) {
    const posts = [];
    const postsQuery = query(collection(db, `subreddits/${subredditName}/posts`));
    const postsInSubreddit = await getDocs(postsQuery);
    postsInSubreddit.forEach((post) => {
      const postData = post.data();
      // Add id of post to object
      const { id } = post;
      posts.push({ ...postData, id });
    });

    return posts;
  }

  // Links user authorization with user name
  async function addUser(email, username) {
    const docRef = await setDoc(doc(db, 'users', username), {
      email,
      username,
      icon: 'https://firebasestorage.googleapis.com/v0/b/reddit-clone-83ce9.appspot.com/o/user_icon.svg?alt=media&token=50e7a9f1-8508-4d51-aac8-4d1ed9dad7a1',
      subreddits: [],
      votes: [],
    });
    return docRef;
  }

  async function getUser(username) {
    const userDoc = await getDoc(doc(db, 'users', username));
    return userDoc.data();
  }
  
  async function getPost(subredditName, postId) {
    const userDoc = await getDoc(doc(db, `subreddits/${subredditName}/posts`, postId));
    return userDoc.data();
  }

  async function getUserByEmail(email) {
    const user = [];
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const userDoc = await getDocs(userQuery);
    userDoc.forEach((data) => user.push(data.data()));
    return user[0];
  }

  async function saveUserIcon(file, username) {
    try {
      const publicImageUrl = uploadImage(file, `users/${username}/icon`);
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

  // This is used to keep track of which subreddits have more posts
  async function incrementNumberOfPosts(subreddit) {
    const postDoc = doc(db, 'subreddits', subreddit);

    // update upVotes in original document
    await updateDoc(postDoc, {
      postQuantity: increment(1),
    });
  }

  // adds a post in the specified subreddit
  async function addTextPost(username, title, subreddit, text) {
    const docRef = await addDoc(collection(db, 'subreddits', subreddit, 'posts'), {
      originalPoster: username,
      title,
      text,
      comments: [],
      upVotes: 0,
      timePosted: new Date().toString(),
    });
    await incrementNumberOfPosts(subreddit);
    return docRef.id;
  }

  async function addImagePost(username, title, subreddit, image) {
    const imageUrl = await uploadImage(image, `postImages/${username}/images`)
    const docRef = await addDoc(collection(db, 'subreddits', subreddit, 'posts'), {
      originalPoster: username,
      title,
      imageUrl,
      comments: [],
      upVotes: 0,
      timePosted: new Date().toString(),
    });
    await incrementNumberOfPosts(subreddit);
    return docRef.id;
  }

  async function addUrlPost(username, title, subreddit, url) {
    const docRef = await addDoc(collection(db, 'subreddits', subreddit, 'posts'), {
      originalPoster: username,
      title,
      url,
      comments: [],
      upVotes: 0,
      timePosted: new Date().toString(),
    });
    await incrementNumberOfPosts(subreddit);
    return docRef.id;
  }

  async function updateVotes(username, subreddit, postId, incrementQuantity, voteType) {
    const postDoc = doc(db, `subreddits/${subreddit}/posts/`, postId);
    const userDoc = doc(db, 'users', username);

    // update upVotes in original document
    await updateDoc(postDoc, {
      upVotes: increment(incrementQuantity),
    });

    // updates votes
    await updateDoc(userDoc, {
      [`votes.${postId}`]: voteType,
    });
  }

  async function addComment(subreddit, postId, comments) {
    const postDoc = doc(db, `subreddits/${subreddit}/posts/`, postId);

    // updates comments
    await updateDoc(postDoc, { comments });
  } 

  async function editSubscription(subreddit, username, callback, userIncrement) {
    const subredditDoc = doc(db, 'subreddits', subreddit);
    const userDoc = doc(db, 'users', username);

    await updateDoc(subredditDoc, {
      members: increment(userIncrement),
    });

    await updateDoc(userDoc, { subreddits: callback(subreddit) });

  }

  async function subscribeToSubreddit(subreddit, username) {
    await editSubscription(subreddit, username, arrayUnion, 1);
  }

  async function unsubscribeFromSubreddit(subreddit, username) {
    await editSubscription(subreddit, username, arrayRemove, -1);
  }

  return {
    getSubredditsData,
    getSubredditData,
    getAllPostsInSubreddit,
    getTopPostsInSubreddit,
    addUser,
    getPost,
    getUser,
    getUserByEmail,
    saveUserIcon,
    addTextPost,
    addImagePost,
    addUrlPost,
    updateVotes,
    addComment,
    subscribeToSubreddit,
    unsubscribeFromSubreddit,
  };
})();

// Used for user sign in and sign up
const authorization = (() => {
  const auth = getAuth(firebaseApp);
  const getUser = () => auth.currentUser;

  function isUserSignedIn() {
    return !!getAuth(firebaseApp).currentUser;
  }

  const loginEmailPassword = async (loginEmail, loginPassword) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
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

  const logOut = async () => {
    signOut(auth);
  };

  const logInPopup = async () => {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new GoogleAuthProvider();
    // const provider = new EmailAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return {
    auth,
    getUser,
    isUserSignedIn,
    logInPopup,
    logIn,
    logOut,
    loginEmailPassword,
    createAccount,
  };
})();

export { database, authorization };
