import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Initialize Firebase Services
const auth = getAuth();
const db = getFirestore();

// ✅ Handle User Authentication
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect to welcome page if not logged in
    } else {
        loadLogs(user.uid); // ✅ Load existing logs for this user
    }
});

// ✅ Open & Close Popup Form
document.getElementById("open-form-btn").addEventListener("click", () => {
    document.getElementById("log-form").classList.remove("hidden");
});

document.getElementById("close-form-btn").addEventListener("click", () => {
    document.getElementById("log-form").classList.add("hidden");
});

// ✅ Handle Form Submission
document.getElementById("diet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mealTime = document.getElementById("meal-time").value;
    const mealDate = document.getElementById("meal-date").value;
    const mealDetails = document.getElementById("meal-details").value;

    const user = auth.currentUser;

    try {
        // ✅ Save log to Firestore under the user’s logs
        await addDoc(collection(db, `logs/${user.uid}/diet`), {
            time: mealTime,
            date: mealDate,
            details: mealDetails
        });

        alert("Log saved!");
        document.getElementById("log-form").classList.add("hidden"); // Close form
        loadLogs(user.uid); // Refresh logs
    } catch (error) {
        console.error("Error saving log:", error);
    }
});

// ✅ Load Existing Logs from Firestore
async function loadLogs(userId) {
    const logsContainer = document.getElementById("logs-container");
    logsContainer.innerHTML = ""; // Clear previous logs

    const logsSnapshot = await getDocs(collection(db, `logs/${userId}/diet`));

    logsSnapshot.forEach((doc) => {
        const log = doc.data();
        const logElement = document.createElement("div");
        logElement.classList.add("log-card");
        logElement.innerHTML = `
            <h3>Date: ${log.date}</h3>
            <p><strong>Details:</strong> ${log.details}</p>
            <p><strong>Time:</strong> ${log.time}</p>
        `;
        logsContainer.appendChild(logElement);
    });
}
