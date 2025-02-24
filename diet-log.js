import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// ✅ Initialize Firebase services
const db = getFirestore();
const auth = getAuth();

// ✅ Function to load logs
async function loadLogs() {
    const user = auth.currentUser;
    if (!user) return;

    const logsContainer = document.getElementById("logs-container");
    logsContainer.innerHTML = ""; // Clear logs before loading new ones

    const querySnapshot = await getDocs(collection(db, `logs/${user.uid}/diet`));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        logsContainer.appendChild(createLogCard(doc.id, data));
    });
}

// ✅ Function to create a log card
function createLogCard(id, data) {
    const card = document.createElement("div");
    card.classList.add("log-card");

    card.innerHTML = `
        <div class="log-header">
            <strong>Date:</strong> ${data.date}
            <button class="delete-btn" data-id="${id}">❌</button>
        </div>
        <p><strong>Details:</strong> ${data.details}</p>
        <p><strong>Time Late:</strong> ${data.time}</p>
        <p><strong>Meal Time:</strong> ${data.mealTime}</p>
        <p><strong>Snack Label:</strong> ${data.snackLabel || "None"}</p>
    `;

    // ✅ Delete button functionality
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, `logs/${auth.currentUser.uid}/diet`, id));
        loadLogs();
    });

    return card;
}

// ✅ Function to save a new log
document.getElementById("diet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const mealDetails = document.getElementById("meal-details").value;
    const mealHour = document.getElementById("meal-hour").value;
    const mealMinute = document.getElementById("meal-minute").value;
    const mealPeriod = document.getElementById("meal-period").value;
    const mealDate = document.getElementById("meal-date").value;
    const snackLabel = document.getElementById("snack-label").value || "None";
    const mealTime = `${mealHour}:${mealMinute} ${mealPeriod}`;

    try {
        await addDoc(collection(db, `logs/${user.uid}/diet`), {
            details: mealDetails,
            time: mealTime,
            date: mealDate,
            mealTime: "Breakfast", // Default, you can modify it later
            snackLabel: snackLabel
        });

        alert("✅ Diet log saved!");
        document.getElementById("diet-form").reset(); // ✅ Clear form
        loadLogs(); // ✅ Reload logs
    } catch (error) {
        console.error("❌ Error saving log:", error);
    }
});

// ✅ Load logs on page load
document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });
});
