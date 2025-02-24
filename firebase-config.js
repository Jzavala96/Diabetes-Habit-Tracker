// ✅ Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRuRHDJ0GC6vtnSCGAcQCtE9yNaLJ1M_Y",
    authDomain: "glucoguardian-b935a.firebaseapp.com",
    projectId: "glucoguardian-b935a",
    storageBucket: "glucoguardian-b935a.appspot.com",
    messagingSenderId: "79327666113",
    appId: "1:79327666113:web:f0cf092399dd1b6dbd9940"
};

// ✅ Ensure Firebase is only initialized once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ✅ Attach Firebase services to the `window` object so they can be used in other scripts
window.firebaseAuth = firebase.auth();
window.firebaseDB = firebase.firestore();
