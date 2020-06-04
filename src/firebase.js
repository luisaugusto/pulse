import firebase from "firebase/app";
import "firebase/firestore";
import { messaging } from "firebase/app";
import "firebase/messaging";

export const firebaseApp = firebase.initializeApp({
  projectId: "pulse-40fa3",
  apiKey: "AIzaSyD-AJWqiNss7ZKUv9UsDHZEbE-KduU3jqs",
  authDomain: "pulse-40fa3.firebaseapp.com",
  messagingSenderId: "237262664495",
  appId: "1:237262664495:web:e14036b2745530c380a7da"
});

export const messages = messaging();

messages.usePublicVapidKey(
  "BJxh800d7aBFnU7HMH-fPH09FGBAIdsk0n9yKeWAKxkrwaNVod5nyM7WXKyvq1vNWixpGB1TA7nCWOojK7je2YI"
);

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messages
  .getToken()
  .then(currentToken => {
    if (currentToken) {
      console.log("Token currently available");
      // sendTokenToServer(currentToken);
      // updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log(
        "No Instance ID token available. Request permission to generate one."
      );
      // Show permission UI.
      // updateUIForPushPermissionRequired();
      // setTokenSentToServer(false);
    }
  })
  .catch(err => {
    console.log("An error occurred while retrieving token. ", err);
    // showToken("Error retrieving Instance ID token. ", err);
    // setTokenSentToServer(false);
  });

// Callback fired if Instance ID token is updated.
messages.onTokenRefresh(() => {
  messaging
    .getToken()
    .then(refreshedToken => {
      console.log("Token refreshed.");
      console.log(refreshedToken);
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      // setTokenSentToServer(false);
      // Send Instance ID token to app server.
      // sendTokenToServer(refreshedToken);
      // ...
    })
    .catch(err => {
      console.log("Unable to retrieve refreshed token ", err);
      // showToken('Unable to retrieve refreshed token ', err);
    });
});

export const db = firebaseApp.firestore();
