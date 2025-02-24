import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

//  Initialize Firebase services
const db = getFirestore();
const auth = getAuth();

//  Track Edit State & Selected Log ID
let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log(" JavaScript Loaded!");

    //  Medication Selection Logic
    const medButtons = document.querySelectorAll(".med-btn");
    const selectedMedInput = document.getElementById("selected-med");

    medButtons.forEach(button => {
        button.addEventListener("click", () => {
            medButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedMedInput.value = button.getAttribute("data-med");
        });
    });
     //  Time of Day Selection Logic
     const timeButtons = document.querySelectorAll(".time-btn");
     const selectedTimeInput = document.getElementById("selected-time");
 
     timeButtons.forEach(button => {
         button.addEventListener("click", () => {
             timeButtons.forEach(btn => btn.classList.remove("selected"));
             button.classList.add("selected");
             selectedTimeInput.value = button.getAttribute("data-time");
         });
     });

    //  Show/Hide Add Sugar Log Form
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");
    const sugarForm = document.getElementById("sugar-form");

    if (openFormBtn && closeFormBtn && logForm) {
        openFormBtn.addEventListener("click", () => {
            editMode = false;
            editLogId = null;
            sugarForm.reset();
            logForm.classList.remove("hidden");
            logForm.style.display = "block";
        });

        closeFormBtn.addEventListener("click", () => {
            logForm.classList.add("hidden");
            logForm.style.display = "none";
        });
    }

    // ✅ Load logs on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });

    // ✅ Function to save or update a log
    sugarForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return;

        const sugarLevel = document.getElementById("sugar-level").value;
        const selectedMed = document.getElementById("selected-med").value;
        const insulinUnits = document.getElementById("insulin-units").value;
        const sugarDate = document.getElementById("sugar-date").value;
        const selectedTime = document.getElementById("selected-time").value;
        const logTime = `${document.getElementById("log-hour").value}:${document.getElementById("log-minute").value} ${document.getElementById("log-period").value}`;

        if (!selectedMed || !selectedTime) {
            alert(" Please select medication and time of day.");
            return;
        }

        try {
            const logData = { sugarLevel, medication: selectedMed, insulinUnits, sugarDate, selectedTime, logTime };

            if (editMode && editLogId) {
                await updateDoc(doc(db, `logs/${user.uid}/sugar`, editLogId), logData);
            } else {
                await addDoc(collection(db, `logs/${user.uid}/sugar`), logData);
            }

            sugarForm.reset();
            logForm.style.display = "none";
            editMode = false;
            editLogId = null;
            loadLogs();
        } catch (error) {
            console.error(" Error saving log:", error);
        }
    });
});

// Function to load logs
async function loadLogs() {
    const user = auth.currentUser;
    if (!user) return;

    const logsContainer = document.getElementById("logs-container");
    logsContainer.innerHTML = ""; // Clear logs before loading new ones

    const querySnapshot = await getDocs(collection(db, `logs/${user.uid}/sugar`));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        logsContainer.appendChild(createLogCard(doc.id, data));
    });
}

// Function to create a log card
function createLogCard(id, data) {
    const card = document.createElement("div");
    card.classList.add("log-card");

    card.innerHTML = `
        <div class="log-header">
            <h3>${data.date}</h3>
            <button class="delete-btn" data-id="${id}">✖</button>
        </div>
        <p><strong>Sugar Level:</strong> ${data.level} mmol/L</p>
        <p><strong>Medication:</strong> ${data.medication}</p>
        <p><strong>Insulin Units:</strong> ${data.insulin}</p>
        <button class="edit-btn" data-id="${id}">Edit</button>
    `;

    // Delete button functionality
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, `logs/${auth.currentUser.uid}/sugar`, id));
        loadLogs();
    });

    return card;
}
