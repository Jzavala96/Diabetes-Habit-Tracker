import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// ✅ Function to get the latest log from Firestore
async function getLatestLog(collectionName, timeField, dateField, valueField, timeElement, dateElement, valueElement = null) {
    const user = auth.currentUser;
    if (!user) return;

    const logsRef = collection(db, `logs/${user.uid}/${collectionName}`);
    const q = query(logsRef, orderBy(dateField, "desc"), orderBy(timeField, "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const latestLog = snapshot.docs[0].data();
        console.log(`Latest ${collectionName} log:`, latestLog);

        document.getElementById(timeElement).textContent = latestLog[timeField] || "--";
        document.getElementById(dateElement).textContent = latestLog[dateField] || "--";

        if (valueElement) {
            document.getElementById(valueElement).textContent = latestLog[valueField] + " mmol/L" || "--";
        }
    } else {
        console.log(`No data found for ${collectionName}`);
    }
}

// ✅ Function to load the user's name from Firebase Auth
function loadUserName() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById("user-name").textContent = user.displayName || "User";

            // ✅ Fetch latest logs
            await getLatestLog("diet", "time", "date", null, "latest-diet-time", "latest-diet-date");
            await getLatestLog("exercise", "time", "date", null, "latest-exercise-time", "latest-exercise-date");
            await getLatestLog("sugar", "time", "date", "level", "latest-sugar-level", "latest-sugar-date", "latest-sugar-level");
        } else {
            console.log("No user logged in.");
        }
    });
}

// ✅ Function to handle sign out
document.getElementById("signout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});

// ✅ Load user data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
});
