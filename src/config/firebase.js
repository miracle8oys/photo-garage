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
    apiKey: "AIzaSyDcEGJKiodvHB3_gqRTBE47r3luU4c3HPM",
    authDomain: "myphoto-gallery.firebaseapp.com",
    projectId: "myphoto-gallery",
    storageBucket: "myphoto-gallery.appspot.com",
    messagingSenderId: "2369753344",
    appId: "1:2369753344:web:5d2addde3d357cafeea3e5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);
const storage = getStorage(app);

const signInWithGoogle = () => {
  signInWithPopup(auth, provider).then(data => {
      console.log(data.user.uid);
      setDoc(doc(db, "users", `${data.user.uid}`), {
          profile_pic: data.user.photoURL,
          username: data.user.displayName
      });
  })
}

export {auth, db, signInWithGoogle, storage}