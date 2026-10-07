import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjOrbdxkRI5DzIVcq5lmxVQ9-mXqfmIis",
  authDomain: "my-pig-farm-8fae4.firebaseapp.com",
  projectId: "my-pig-farm-8fae4",
  storageBucket: "my-pig-farm-8fae4.firebasestorage.app",
  messagingSenderId: "434142510278",
  appId: "1:434142510278:web:58826c16c9c3b9cac32bc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
