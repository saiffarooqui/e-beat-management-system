import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import * as geofirestore from "geofirestore";

// Initialize the Firebase SDK
firebase.initializeApp({
  // ...
  apiKey: "AIzaSyBuXVq0HNc5A8p-uwHiS1MXvyuU9Hm13f0",
  authDomain: "tracker-29efa.firebaseapp.com",
  projectId: "tracker-29efa",
  storageBucket: "tracker-29efa.appspot.com",
  messagingSenderId: "394162081407",
  appId: "1:394162081407:web:933a42c491457aa549b94a",
  databaseURL: "https://tracker-29efa.firebaseio.com",
});

// Create a Firestore reference
const firestore = firebase.firestore();
firestore.settings({ experimentalAutoDetectLongPolling:  true, merge: true });
// Create a GeoFirestore reference
const GeoFirestore = geofirestore.initializeApp(firestore);

// Create a GeoCollection reference
const db = GeoFirestore.collection("vendors");
// db.settings({
//     cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
//     merge: true
// })
// db.enablePersistence()
export default db;
