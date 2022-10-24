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
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';

const firebaseApp = initializeApp(getFirebaseConfig());

const db = getFirestore(firebaseApp);

async function getSubredditsData() {
  const names = [];
  const subreddits = await getDocs(query(collection(db, 'subreddits')));

  subreddits.forEach((subreddit) => names.push(
    {name: subreddit.data().name, icon: subreddit.data().icon }));

  return names;
}

async function getAllPostsInSubreddit(subredditName) {
  const posts = [];
  const postsQuery = query(collection(db, `subreddits/${subredditName}/posts`), orderBy('timePosted', 'desc'), limit(10));
  const postsInSubreddit = await getDocs(postsQuery);
  postsInSubreddit.forEach((post) => posts.push(post.data()));

  return posts;
}

async function getTopPostsInSubreddit(subredditName) {
  const posts = [];
  const postsInSubreddit = await getDocs(query(collection(db, `subreddits/${subredditName}/posts`)));
  postsInSubreddit.forEach((post) => posts.push(post.data()));

  return posts;
}

const database = { getSubredditsData, getAllPostsInSubreddit, getTopPostsInSubreddit };

export default database;
