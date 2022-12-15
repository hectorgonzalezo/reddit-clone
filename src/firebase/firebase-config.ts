const config ={
  apiKey: "AIzaSyDnj6g8O-OKQTa40j53yJWXuZim4qQX70g",
  authDomain: "reddit-clone-83ce9.firebaseapp.com",
  projectId: "reddit-clone-83ce9",
  storageBucket: "reddit-clone-83ce9.appspot.com",
  messagingSenderId: "450701697923",
  appId: "1:450701697923:web:784074b9520bd873138cb6",
  measurementId: "G-QEJSVGKLB2"
}; 

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return config;
  }
}
