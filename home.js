import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Initialize Firebase Services
const auth = getAuth();
const db = getFirestore();

// ✅ Load User Data
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html"; // ✅ Redirect to welcome page if user is not logged in
        return;
    }

    // ✅ Get User's First Name
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        document.getElementById("user-name").textContent = userDoc.data().firstName || "User";
    }

    // ✅ Get Latest Diet Log
    const dietDoc = await getDoc(doc(db, "logs", `diet-${user.uid}`));
    if (dietDoc.exists()) {
        document.getElementById("diet-time").textContent = dietDoc.data().time || "--";
        document.getElementById("diet-date").textContent = dietDoc.data().date || "--";
    }

    // ✅ Get Latest Exercise Log
    const exerciseDoc = await getDoc(doc(db, "logs", `exercise-${user.uid}`));
    if (exerciseDoc.exists()) {
        document.getElementById("exercise-time").textContent = exerciseDoc.data().time || "--";
        document.getElementById("exercise-date").textContent = exerciseDoc.data().date || "--";
    }

    // ✅ Get Latest Sugar Level Log
    const sugarDoc = await getDoc(doc(db, "logs", `sugar-${user.uid}`));
    if (sugarDoc.exists()) {
        document.getElementById("sugar-level").textContent = sugarDoc.data().level || "-- mmol/l";
        document.getElementById("sugar-date").textContent = sugarDoc.data().date || "--";
    }
});

// ✅ Logout Functionality
document.querySelector(".signout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "welcome.html"; // ✅ Redirect to welcome page after signing out
    } catch (error) {
        console.error("Logout failed:", error);
    }
});
