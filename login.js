import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
    const loginForm = document.getElementById("login-form");
    const faceIdBtn = document.getElementById("face-id-btn");

    // ✅ Check if Face ID is Available
    if (await isFaceIdAvailable()) {
        faceIdBtn.style.display = "block"; // Show Face ID button
    }

    // ✅ Manual Login with Email/Password
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Logged in:", userCredential.user);
            window.location.href = "home.html"; // ✅ Redirect on success
        } catch (error) {
            console.error("❌ Login Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });

    // ✅ Face ID Authentication
    faceIdBtn.addEventListener("click", async () => {
        try {
            const user = await authenticateWithFaceId();
            if (user) {
                console.log("✅ Face ID login successful!", user);
                window.location.href = "home.html"; // Redirect on success
            }
        } catch (error) {
            console.error("❌ Face ID Authentication Failed:", error);
            alert("Face ID login failed.");
        }
    });
});

// ✅ Check if Face ID is Available
async function isFaceIdAvailable() {
    if (window.PublicKeyCredential) {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return false;
}

// ✅ Face ID Authentication Using WebAuthn
async function authenticateWithFaceId() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("❌ No authenticated user.");
    }

    // ✅ Get saved Face ID credentials from Firestore
    const credRef = doc(db, "faceid", user.uid);
    const credSnap = await getDoc(credRef);

    if (!credSnap.exists()) {
        throw new Error("❌ No Face ID credentials found. Please log in manually first.");
    }

    const credentialId = credSnap.data().credentialId;

    // ✅ Use WebAuthn API for authentication
    const assertion = await navigator.credentials.get({
        publicKey: {
            challenge: new Uint8Array(32),
            allowCredentials: [{ id: credentialId, type: "public-key" }],
            userVerification: "required",
        },
    });

    if (assertion) {
        return user;
    } else {
        throw new Error("❌ Face ID Authentication failed.");
    }
}
