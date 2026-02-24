// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8WZGgK37nKph5gfOL-cjbtdo-doEEiWc",
  authDomain: "mana-nizamabad-pasupu.firebaseapp.com",
  projectId: "mana-nizamabad-pasupu",
  storageBucket: "mana-nizamabad-pasupu.appspot.com",
  messagingSenderId: "916689801093",
  appId: "1:916689801093:web:d8fc0ebb5dd4b9e7ff7eec"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
