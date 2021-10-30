// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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


function sendSignInLinkToEmail(email) {
  const actionCodeSettings = {
    url: 'http://localhost/login',
    handleCodeInApp: true
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    console.log("sent!")
    window.localStorage.setItem('emailForSignIn', email);
  })
}

export { sendSignInLinkToEmail }
