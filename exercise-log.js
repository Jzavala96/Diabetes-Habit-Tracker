import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Initialize Firebase Services
const auth = getAuth();
const db = getFirestore();

// ✅ Handle User Authentication
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
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
document.getElementById("exercise-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const exerciseTime = document.getElementById("exercise-time").value;
    const bodyWeight = document.getElementById("body-weight").value;
    const exerciseDate = document.getElementById("exercise-date").value;
    const intensityLevel = document.getElementById("intensity-level").value;

    const user = auth.currentUser;

    try {
        // ✅ Save log to Firestore under the user’s logs
        await addDoc(collection(db, `logs/${user.uid}/exercise`), {
            time: exerciseTime,
            weight: bodyWeight,
            date: exerciseDate,
            intensity: intensityLevel
        });

        alert("Exercise log saved!");
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

    const logsSnapshot = await getDocs(collection(db, `logs/${userId}/exercise`));

    logsSnapshot.forEach((doc) => {
        const log = doc.data();
        const logElement = document.createElement("div");
        logElement.classList.add("log-card");
        logElement.innerHTML = `
            <h3>Date: ${log.date}</h3>
            <p><strong>Workout Duration:</strong> ${log.time}</p>
            <p><strong>Body Weight:</strong> ${log.weight} lbs</p>
            <p><strong>Intensity Level:</strong> ${log.intensity}</p>
        `;
        logsContainer.appendChild(logElement);
    });
}

