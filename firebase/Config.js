import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app)
export { db, auth, storage }
