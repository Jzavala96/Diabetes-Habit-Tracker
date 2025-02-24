import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Initialize Firebase Services
const auth = getAuth();
const db = getFirestore();

// ✅ Ensure User is Authenticated
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect if not logged in
    } else {
        loadLogs(user.uid); // ✅ Load existing logs for this user
    }
});

// ✅ Ensure the "Add Diet" button is clickable
document.addEventListener("DOMContentLoaded", () => {
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");

    if (openFormBtn && closeFormBtn && logForm) {
        // ✅ Open form when clicking "Add Diet"
        openFormBtn.addEventListener("click", () => {
            logForm.classList.remove("hidden");
            logForm.style.display = "block"; // ✅ Ensure form becomes visible
        });

        // ✅ Close form when clicking "Cancel"
        closeFormBtn.addEventListener("click", () => {
            logForm.classList.add("hidden");
            logForm.style.display = "none"; // ✅ Ensure form is hidden again
        });
    } else {
        console.error("Form or button elements not found!");
    }
});

// ✅ Handle Form Submission and Save to Firestore
document.getElementById("diet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mealTime = document.getElementById("meal-time").value;
    const mealDate = document.getElementById("meal-date").value;
    const mealDetails = document.getElementById("meal-details").value;

    const user = auth.currentUser;

    try {
        await addDoc(collection(db, `logs/${user.uid}/diet`), {
            time: mealTime,
            date: mealDate,
            details: mealDetails
        });

        alert("Diet log saved!");
        document.getElementById("log-form").classList.add("hidden"); // Hide form
        document.getElementById("log-form").style.display = "none";
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
            <p><strong>Time:</strong> ${log.time}</p>
            <p><strong>Meal Details:</strong> ${log.details}</p>
        `;
        logsContainer.appendChild(logElement);
    });
}
