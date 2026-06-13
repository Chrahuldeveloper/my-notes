import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBm6AJ85q6oyM3XYSUgZU-l0rNTQUjRcgc",
  authDomain: "mynotes-e2e21.firebaseapp.com",
  projectId: "mynotes-e2e21",
  storageBucket: "mynotes-e2e21.firebasestorage.app",
  messagingSenderId: "664074146392",
  appId: "1:664074146392:web:ad02137ab277f57ae0702d",
  measurementId: "G-WDXJPN67X7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export {db}