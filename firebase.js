import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/*
  ここを Firebase コンソールで表示された自分の値に置き換える
*/


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
  serverTimestamp,
  getDocs
};