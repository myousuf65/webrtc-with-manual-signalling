import firebase from "firebase"
import "firebase/firestore"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBIoZ9VK-M_XK7mK-hVUljtw9Ny2t1D5lI",
  authDomain: "chat-application-c3a2b.firebaseapp.com",
  projectId: "chat-application-c3a2b",
  storageBucket: "chat-application-c3a2b.appspot.com",
  messagingSenderId: "584121627068",
  appId: "1:584121627068:web:45a5ac6492feb8adebbbb9"
};

const app = initializeApp(firebaseConfig);


const db = getFirestore()
export const callsCollection = collection(db, 'call')
