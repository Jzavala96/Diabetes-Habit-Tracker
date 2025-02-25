import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

async function getLatestLog(collectionName, timeField, dateField, valueField, timeElement, dateElement, valueElement = null) {
    const user = auth.currentUser;
    if (!user) {
        console.log("No authenticated user.");
        return;
    }

    // Firestore collection
    const logsRef = collection(db, `logs/${user.uid}/${collectionName}`);

    // most recent entry (sorted by date first, then time)
    const q = query(logsRef, orderBy(dateField, "desc"), orderBy(timeField, "desc"), limit(1));

    try {
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const latestLog = snapshot.docs[0].data();
            console.log(`Latest ${collectionName} Log:`, latestLog);

            document.getElementById(timeElement).textContent = latestLog[timeField] || "--";
            document.getElementById(dateElement).textContent = latestLog[dateField] || "--";

            if (valueElement) {
                document.getElementById(valueElement).textContent = latestLog[valueField] + " mmol/L";
            }
        } else {
            console.log(` No logs found for ${collectionName}`);
        }
    } catch (error) {
        console.error(`Error fetching ${collectionName} log:`, error);
    }
}

async function loadUserName() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                document.getElementById("user-name").textContent = userData.firstName || "User";
            } else {
                document.getElementById("user-name").textContent = "User";
            }

            getLatestLog("diet", "time", "date", null, "latest-diet-time", "latest-diet-date");
            getLatestLog("exercise", "time", "date", null, "latest-exercise-time", "latest-exercise-date");
            getLatestLog("sugar", "logTime", "sugarDate", "sugarLevel", "latest-sugar-level", "latest-sugar-date", "latest-sugar-level");
        }
    });
}

document.getElementById("signout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
        });
    } else {
        console.error("ERROR: Menu toggle button or nav menu not found.");
    }
});
