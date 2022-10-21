// Saves a new message to Cloud Firestore.
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
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
async function lookForResult(location, character) {
  // Look with 100 pixels of tolerance
  const fuzzyRefX = query(
    collection(db, 'results'),
    where('x', '>', location.x - 50),
    where('x', '<', location.x + 50),
  );
  const fuzzyRefY = query(
    collection(db, 'results'),
    where('y', '>', location.y - 50),
    where('y', '<', location.y + 50),
  );

  const fuzzyResultX = await getDocs(fuzzyRefX);
  const fuzzyResultY = await getDocs(fuzzyRefY);

  // This will hold the character names for elements in x and y
  let fuzzyResults = [];

  fuzzyResultX.forEach((doc) => {
    // Add character to reference array
    fuzzyResults.push(doc.data().character);
  });

  fuzzyResultY.forEach((doc) => {
    // Add character to reference array
    fuzzyResults.push(doc.data().character);
  });

  fuzzyResults = fuzzyResults.filter((item) => item === character);
  // Only return true if both searches found the same character, and if its the right one
  if (
    fuzzyResults.length === 2
    && fuzzyResults[0] === character
    && fuzzyResults[0] === fuzzyResults[1]
  ) {
    return true;
  }

  return false;
}

// This function gets called by the modal displayed after the user wins
async function submitUserScore(scoreData) {
  try {
    await addDoc(collection(db, 'Scores'), scoreData);
    return true;
  } catch (err) {
    console.log(err);
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

const database = { lookForResult, submitUserScore, getTopScores };

export default database;
