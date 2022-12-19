import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const config ={
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "reddit-clone-83ce9.firebaseapp.com",
  projectId: "reddit-clone-83ce9",
  storageBucket: "reddit-clone-83ce9.appspot.com",
  messagingSenderId: "450701697923",
  appId: "1:450701697923:web:784074b9520bd873138cb6",
  measurementId: "G-QEJSVGKLB2"
}; 

const firebaseApp = initializeApp(config);

// uploads an image to firestore
// arguments are the file to upload and the path to upload it to
export default async function uploadImage(
    file: File,
    path: string
  ): Promise<string> {
    try {
      // Upload the image to Cloud Storage.
      const filePath = `${path}${file.name}`;
      const newImageRef = ref(getStorage(firebaseApp), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);
      console.log({fileSnapshot})
      // Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);
      return publicImageUrl;
    } catch (error) {
      console.log(`couldn't upload ${file.name}`);
      throw error;
    }
  }