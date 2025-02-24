// ✅ Import Firebase Authentication and Firestore
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

// ✅ Get user data on page load
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // ✅ Get user ID
        const userId = user.uid;

        // ✅ Reference to Firestore document
        const userDocRef = doc(db, "users", userId);

        try {
            // ✅ Fetch user document from Firestore
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // ✅ Extract first name from Firestore data
                const firstName = userDoc.data().firstName;
                document.getElementById("user-name").textContent = firstName || "User";
            } else {
                console.log("No user data found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // ✅ Redirect to login if no user is logged in
        window.location.href = "login.html";
    }
});

// ✅ Logout Functionality
document.querySelector("button").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout failed:", error);
    }
});
