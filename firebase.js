import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/*
  ここを Firebase コンソールで表示された自分の値に置き換える
*/
const firebaseConfig = {
  apiKey: "AIzaSyApW3x87k2uXR-u76Yl1Ey9LjGLn5CAwzU",
  authDomain: "smmytype.firebaseapp.com",
  projectId: "smmytype",
  storageBucket: "smmytype.firebasestorage.app",
  messagingSenderId: "982406413497",
  appId: "1:982406413497:web:c1820b8c1ae2ff6ad66f68",
  measurementId: "G-JPGEG820KT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp
};
