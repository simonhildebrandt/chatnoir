// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  connectFirestoreEmulator,
  addDoc,
  doc
} from "firebase/firestore"
import {
  getAuth,
  sendSignInLinkToEmail,
  connectAuthEmulator,
  onAuthStateChanged,
  signOut,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithCustomToken
} from "firebase/auth";

import { useEffect, useState } from 'react';

import axios from 'axios';

import { navigate } from './router';


const firebaseConfig = {
  apiKey: "AIzaSyDme-zl2jh6cfX5j-OtD320GTARdy9McIc",
  authDomain: "chatnoir-4f6f7.firebaseapp.com",
  projectId: "chatnoir-4f6f7",
  storageBucket: "chatnoir-4f6f7.appspot.com",
  messagingSenderId: "1049197189431",
  appId: "1:1049197189431:web:5db56bb3e2dde6500c62b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();


export const host = process.env.SITE_URL || "http://localhost:9000";


if (!process.env.SITE_URL) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8090);
}


function sendSignInLink(email) {
  const actionCodeSettings = {
    url: 'http://localhost:9000/login',
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    console.log("sent!")
    window.localStorage.setItem('emailForSignIn', email);
  })
}

function handleSigninLink() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    console.log("signin link!")

    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }

    signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      console.log("logged in!", result)
      navigate("/")
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
      console.error("failed login")
    })
    .finally(() => navigate("/"));
  } else {
    console.log("not signing link")
  }

}

function processInvite(id) {
  console.log("processing invite", id);

  API_URL = "http://localhost:5001/chatnoir-4f6f7/us-central1"
  axios.post(API_URL + "/tokenForInvite", {id})
  .then(({data: {customToken}}) => {
    console.log({customToken})
    signInWithCustomToken(auth, customToken)
    .then(user => console.log("user!", user))
    .catch(error => {
      const { code: errorCode, message: errorMessage } = error
        console.log("error!", { errorCode, errorMessage })
        console.log(errorCode)
        console.log(errorMessage)
    })
  })
}

function withUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, userData => {
      if (userData) {
        // const uid = user.uid;
        console.log("We got a user!", userData);
        setUser(userData);
      } else {
        console.log("We're userless")
        setUser(false);
      }
    });

    return unsub;
  }, [])

  return user;
}

export const objectFromDocs = snapshot => {
  const hash = {};
  snapshot.docs.map(doc => hash[doc.id] = doc.data());
  return hash;
}

function useFirestoreCollection(path, clause = null) {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const col = collection(db, path);

    let q = query(
      col,
      ...(clause ? [where(...clause)] : [])
    );

    const unsub = onSnapshot(q, querySnapshot => {
      setData(objectFromDocs(querySnapshot));
      setLoaded(true);
    });

    return () => { unsub() };
  }, [path]);

  return { data, loaded };
}

function useFirestoreDocument(path) {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, path), snapshot => {
      setData(snapshot.data());
      setLoaded(true);
    });

    return () => { unsub() };
  }, [path]);

  return { data, loaded };
}


function createDocument(path, data) {
  console.log("creating", {path, data})
  return addDoc(collection(db, path), data);
}



export {
  sendSignInLink,
  handleSigninLink,
  withUser,
  processInvite,
  useFirestoreCollection,
  useFirestoreDocument,
  createDocument
}
