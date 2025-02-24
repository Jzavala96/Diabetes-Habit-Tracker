// ✅ Import necessary Firebase Authentication functions
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

// ✅ Import Firebase Configuration (Ensure firebase-config.js is using modular Firebase)
import { firebaseConfig } from "./firebase-config.js";

// ✅ Initialize Firebase (Ensures Firebase is initialized before using auth)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Logged in:", userCredential.user);
            window.location.href = 'dashboard.html'; // ✅ Redirect on success
        } catch (error) {
            console.error("❌ Login Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });
});
