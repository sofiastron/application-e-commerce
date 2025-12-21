// Importations Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ⚠️ Ta configuration Firebase (nouveau projet)
const firebaseConfig = {
  apiKey: "AIzaSyDtK6XLQZuzBdLUq3G2kJ3hNpijcAZUtV0",
  authDomain: "forum-communautaire.firebaseapp.com",
  projectId: "forum-communautaire",
  storageBucket: "forum-communautaire.firebasestorage.app",
  messagingSenderId: "558759325680",
  appId: "1:558759325680:web:ab12e7f6c2610129bd7735"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export
export { app, auth, db, storage };
