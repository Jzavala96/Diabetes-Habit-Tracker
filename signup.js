import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;
        const confirmEmail = document.getElementById("confirm-email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (email !== confirmEmail) {
            alert("Emails do not match.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //display name in Firebase Auth
            await updateProfile(user, {
                displayName: firstName
            });

            // user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                uid: user.uid
            });

            console.log("User info saved!");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error:", error.message);
            alert("Error: " + error.message);
        }
    });
});
