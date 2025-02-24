// ✅ Import necessary Firebase functions
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

// ✅ Import Firebase Configuration
import { firebaseConfig } from "./firebase-config.js";

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            // ✅ Correct way to sign in user in Firebase Modular SDK
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Logged in:", userCredential.user);
            window.location.href = "dashboard.html"; // Redirect on success
        } catch (error) {
            console.error("❌ Login Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });
});
