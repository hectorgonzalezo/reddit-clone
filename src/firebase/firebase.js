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

// Gets x and y coordinates of original images and looks if they exist in the
// 'result' collection on database.
async function getSubredditNames(location, character) {
  const names = [];
  const subreddits = await getDocs(query(collection(db, 'subreddits')));

  subreddits.forEach((subreddit) => names.push(subreddit.data().name));

  return names;
}

async function getAllPostsInSubreddit(subredditName) {
  const posts = [];
  const postsInSubreddit = await getDocs(query(collection(db, `subreddits/${subredditName}/posts`)));
  postsInSubreddit.forEach((post) => posts.push(post.data()));


  return posts;
}

// This function gets called by the modal displayed after the user wins
async function submitUserScore(scoreData) {
  try {
    await addDoc(collection(db, 'Scores'), scoreData);
    return true;
  } catch (err) {
    return false
  }
}

// Gets top ten scores to de displayed by WinModal
async function getTopScores(all = false) {
  const result = [];
  let scoresQuery;

  // get all queries for leadeboard
  if (all) {
    scoresQuery = query(collection(db, 'Scores'), orderBy('score', 'asc'));
  } else {
  // get only top ten for Win Modal
    scoresQuery = query(collection(db, 'Scores'), orderBy('score', 'asc'), limit(10));
  }

  const scores = await getDocs(scoresQuery);

  scores.forEach((doc) => {
    // Add character to reference array
    result.push(doc.data());
  });

  return result;
}

const database = { getSubredditNames, getAllPostsInSubreddit, submitUserScore, getTopScores };

export default database;
