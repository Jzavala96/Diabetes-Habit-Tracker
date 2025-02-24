import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Function to get the latest log from a specific collection
async function getLatestLog(collectionName, timeField, dateField, valueField, timeElement, dateElement, valueElement = null) {
    const user = auth.currentUser;
    if (!user) return;

    const logsRef = collection(db, `logs/${user.uid}/${collectionName}`);
    const q = query(logsRef, orderBy(dateField, "desc"), orderBy(timeField, "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const latestLog = snapshot.docs[0].data();
        document.getElementById(timeElement).textContent = latestLog[timeField];
        document.getElementById(dateElement).textContent = latestLog[dateField];
        if (valueElement) {
            document.getElementById(valueElement).textContent = latestLog[valueField] + " mmol/L";
        }
    }
}

// Function to load the user's name
function loadUserName() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userName = user.displayName ? user.displayName.split(" ")[0] : "User";
            document.getElementById("user-name").textContent = userName;
            getLatestLog("diet", "time", "date", null, "latest-diet-time", "latest-diet-date");
            getLatestLog("exercise", "time", "date", null, "latest-exercise-time", "latest-exercise-date");
            getLatestLog("sugar", "time", "date", "level", "latest-sugar-level", "latest-sugar-date", "latest-sugar-level");
        }
    });
}

// Function to handle sign out
document.getElementById("signout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});

// Load user data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
});
