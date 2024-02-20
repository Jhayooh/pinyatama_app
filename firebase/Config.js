import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBfMhYoVZ9MN9wSroh1qbV6hQyDZe4tJr8",
  authDomain: "pinyatama-64d69.firebaseapp.com",
  databaseURL: "https://pinyatama-64d69-default-rtdb.firebaseio.com",
  projectId: "pinyatama-64d69",
  storageBucket: "pinyatama-64d69.appspot.com",
  messagingSenderId: "803256069809",
  appId: "1:803256069809:web:b0ea46ebd77df544dbfc90"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
