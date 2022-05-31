import firebaseConfig from "./firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

initializeApp(firebaseConfig);
const db = getFirestore();

export default db;

