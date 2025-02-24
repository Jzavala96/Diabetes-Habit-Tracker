import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in:", userCredential.user);
            window.location.href = "home.html"; 
        } catch (error) {
            console.error("Login Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });
});
