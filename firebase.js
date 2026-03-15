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
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app-check.js"

/*
  ここを Firebase コンソールで表示された自分の値に置き換える
*/
const firebaseConfig = {
  apiKey: "AIzaSyApW3x87k2uXR-u76Yl1Ey9LjGLn5CAwzU",
  authDomain: "smmytype.firebaseapp.com",
  projectId: "smmytype",
  storageBucket: "smmytype.firebasestorage.app",
  messagingSenderId: "982406413497",
  appId: "1:982406413497:web:241e64900ed2ee62d66f68",
  measurementId: "G-V4LYYSXKK6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("ここにSiteKey"),
  isTokenAutoRefreshEnabled: true
});

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
