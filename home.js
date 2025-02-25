import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// ✅ Function to get the latest log from Firestore
async function getLatestLog(collectionName, timeField, dateField, valueField, timeElement, dateElement, valueElement = null) {
    const user = auth.currentUser;
    if (!user) {
        console.log("❌ No authenticated user.");
        return;
    }

    // ✅ Reference to Firestore collection
    const logsRef = collection(db, `logs/${user.uid}/${collectionName}`);

    // ✅ Query for the most recent entry (sorted by date dynamically)
    const q = query(logsRef, orderBy(dateField, "desc"), limit(1));

    try {
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const latestLog = snapshot.docs[0].data();
            console.log(`✅ Latest ${collectionName} Log:`, latestLog); // Debugging

            // ✅ Update UI elements
            document.getElementById(timeElement).textContent = latestLog[timeField] || "--";
            document.getElementById(dateElement).textContent = latestLog[dateField] || "--";
            
            if (valueElement) {
                document.getElementById(valueElement).textContent = latestLog[valueField] + " mmol/L";
            }
        } else {
            console.log(`⚠️ No logs found for ${collectionName}`);
        }
    } catch (error) {
        console.error(`❌ Error fetching ${collectionName} log:`, error);
    }
}

// ✅ Function to load the user's name
async function loadUserName() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // ✅ Fetch user's first name from Firestore (now uses correct document path)
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                document.getElementById("user-name").textContent = userData.firstName || "User";
            } else {
                document.getElementById("user-name").textContent = "User";
            }

            // ✅ Fetch latest logs for each category (dynamically using correct fields)
            getLatestLog("diet", "time", "date", null, "latest-diet-time", "latest-diet-date");
            getLatestLog("exercise", "time", "date", null, "latest-exercise-time", "latest-exercise-date");
            getLatestLog("sugar", "logTime", "sugarDate", "sugarLevel", "latest-sugar-level", "latest-sugar-date", "latest-sugar-level");
        }
    });
}

// ✅ Function to handle sign-out
document.getElementById("signout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("❌ Error signing out:", error);
    });
});

// ✅ Load user data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
});
