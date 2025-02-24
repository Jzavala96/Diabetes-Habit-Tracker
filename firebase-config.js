import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

export const firebaseConfig = {
    apiKey: "AIzaSyCRuRHDJ0GC6vtnSCGAcQCtE9yNaLJ1M_Y",
    authDomain: "glucoguardian-b935a.firebaseapp.com",
    projectId: "glucoguardian-b935a",
    storageBucket: "glucoguardian-b935a.appspot.com",
    messagingSenderId: "79327666113",
    appId: "1:79327666113:web:f0cf092399dd1b6dbd9940"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
