// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {getFirestore, doc, setDoc} from "@firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9rQUUs9lCHVg8acUWfHOQZH2A658m7ZE",
  authDomain: "photo-garage.firebaseapp.com",
  projectId: "photo-garage",
  storageBucket: "photo-garage.appspot.com",
  messagingSenderId: "540679520729",
  appId: "1:540679520729:web:cc7d2b6ff371fe095e59c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);
const storage = getStorage(app);

const signInWithGoogle = () => {
  signInWithPopup(auth, provider).then(data => {
      setDoc(doc(db, "users", `${data.user.uid}`), {
          profile_pic: data.user.photoURL,
          username: data.user.displayName
      });
  })
}

export {auth, db, signInWithGoogle, storage}