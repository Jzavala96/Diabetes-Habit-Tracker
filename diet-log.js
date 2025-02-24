import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// ✅ Initialize Firebase services
const db = getFirestore();
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JavaScript Loaded!");

    // ✅ Meal Selection Logic
    const mealButtons = document.querySelectorAll(".meal-btn");
    const selectedMealInput = document.getElementById("selected-meal");

    mealButtons.forEach(button => {
        button.addEventListener("click", () => {
            mealButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedMealInput.value = button.getAttribute("data-meal");
        });
    });

    // ✅ Show/Hide Add Diet Form
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");

    if (openFormBtn && closeFormBtn && logForm) {
        openFormBtn.addEventListener("click", () => {
            console.log("✅ Add Diet Clicked!");
            logForm.classList.remove("hidden");
            logForm.style.display = "block";
        });

        closeFormBtn.addEventListener("click", () => {
            console.log("✅ Cancel Clicked!");
            logForm.classList.add("hidden");
            logForm.style.display = "none";
        });
    } else {
        console.error("❌ ERROR: Form elements not found!");
    }

    // ✅ Load logs on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });
});

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
            <h3>${data.date}</h3>
            <button class="delete-btn" data-id="${id}">❌</button>
        </div>
        <p><strong>Details:</strong> ${data.details}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Meal Type:</strong> ${data.mealType || "Not Specified"}</p>
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
    const selectedMeal = document.getElementById("selected-meal").value;
    const mealTime = `${mealHour}:${mealMinute} ${mealPeriod}`;

    if (!selectedMeal) {
        alert("❌ Please select a meal type before saving.");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, `logs/${user.uid}/diet`), {
            details: mealDetails,
            time: mealTime,
            date: mealDate,
            mealType: selectedMeal,
            snackLabel: snackLabel
        });

        // ✅ Add log card to the list immediately instead of showing an alert
        const newLog = createLogCard(docRef.id, {
            details: mealDetails,
            time: mealTime,
            date: mealDate,
            mealType: selectedMeal,
            snackLabel: snackLabel
        });
        document.getElementById("logs-container").prepend(newLog);

        // ✅ Close form after saving
        document.getElementById("diet-form").reset();
        logForm.style.display = "none";

    } catch (error) {
        console.error("❌ Error saving log:", error);
    }
});
