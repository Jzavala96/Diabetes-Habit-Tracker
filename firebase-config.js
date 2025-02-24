import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRuRHDJ0GC6vtnSCGAcQCtE9yNaLJ1M_Y",
    authDomain: "glucoguardian-b935a.firebaseapp.com",
    projectId: "glucoguardian-b935a",
    storageBucket: "glucoguardian-b935a.firebasestorage.app",
    messagingSenderId: "79327666113",
    appId: "1:79327666113:web:f0cf092399dd1b6dbd9940"
  };
  
 // Initialize Firebase
const app = initializeApp(firebaseConfig);
  
 // Initialize other Firebase services as needed
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
  