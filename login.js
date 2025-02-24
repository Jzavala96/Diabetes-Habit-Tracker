// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const auth = getAuth(app);

// Handle Email Login
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login Successful!");
            window.location.href = "dashboard.html"; // Redirect to Dashboard
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

// ✅ Face ID Authentication (WebAuthn)
document.getElementById("biometric-btn").addEventListener("click", async function() {
    try {
        const publicKey = {
            challenge: new Uint8Array(32),
            rp: { name: "GlucoGuardian" },
            user: {
                id: new Uint8Array(16),
                name: "user@example.com",
                displayName: "User"
            },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }]
        };

        const credential = await navigator.credentials.create({ publicKey });

        if (credential) {
            alert("Face ID Authentication Successful!");
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        alert("Face ID Authentication Failed: " + error.message);
    }
});
