import firebase from "firebase/app";
import "firebase/firestore";

export const firebaseApp = firebase.initializeApp({
  projectId: "pulse-40fa3",
  apiKey: "AIzaSyD-AJWqiNss7ZKUv9UsDHZEbE-KduU3jqs",
  authDomain: "pulse-40fa3.firebaseapp.com"
});

export const db = firebaseApp.firestore();
