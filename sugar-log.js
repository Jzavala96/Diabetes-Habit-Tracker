import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded!");

    // Medication Selection 
    const medButtons = document.querySelectorAll(".med-btn");
    const selectedMedInput = document.getElementById("selected-med");

    medButtons.forEach(button => {
        button.addEventListener("click", () => {
            medButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedMedInput.value = button.getAttribute("data-med");
        });
    });

    //Time of Day Selection
    const timeButtons = document.querySelectorAll(".time-btn");
    const selectedTimeInput = document.getElementById("selected-time");

    timeButtons.forEach(button => {
        button.addEventListener("click", () => {
            timeButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedTimeInput.value = button.getAttribute("data-time");
        });
    });

    // Show/Hide Add Sugar Log Form
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

    // Load logs on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });

    // save or update a log
    sugarForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return;

        const sugarLevel = document.getElementById("sugar-level").value || "N/A";
        const selectedMed = document.getElementById("selected-med").value || "None";
        const insulinUnits = document.getElementById("insulin-units").value || "0";
        const sugarDate = document.getElementById("sugar-date").value || "Unknown";
        const selectedTime = document.getElementById("selected-time").value || "Not Specified";
        const logTime = `${document.getElementById("log-hour").value}:${document.getElementById("log-minute").value} ${document.getElementById("log-period").value}` || "Not Specified";

        if (!selectedMed || !selectedTime) {
            alert("Please select medication and time of day.");
            return;
        }

        try {
            const logData = {
                sugarLevel,
                medication: selectedMed,
                insulinUnits,
                sugarDate,
                selectedTime,
                logTime
            };

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
            console.error("Error saving log:", error);
        }
    });
});

// load logs
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

// create a log card
function createLogCard(id, data) {
    const card = document.createElement("div");
    card.classList.add("log-card");

    card.innerHTML = `
        <div class="log-header">
            <h3>${data.sugarDate || "No Date"}</h3>
            <button class="delete-btn" data-id="${id}">✖</button>
        </div>
        <p><strong>Sugar Level:</strong> ${data.sugarLevel ? `${data.sugarLevel} mmol/L` : "Not recorded"}</p>
        <p><strong>Medication:</strong> ${data.medication || "None"}</p>
        <p><strong>Insulin Units:</strong> ${data.insulinUnits || "0"}</p>
        <p><strong>Time of Day:</strong> ${data.selectedTime || "Not Specified"}</p>
        <p><strong>Time:</strong> ${data.logTime || "Not Specified"}</p>
        <button class="edit-btn" data-id="${id}">Edit</button>
    `;

    // Delete button 
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, `logs/${auth.currentUser.uid}/sugar`, id));
        loadLogs();
    });

    // Edit button
    card.querySelector(".edit-btn").addEventListener("click", async () => {
        console.log("📝 Edit Clicked!");

        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, `logs/${user.uid}/sugar`, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById("sugar-level").value = data.sugarLevel;
            document.getElementById("selected-med").value = data.medication;
            document.getElementById("insulin-units").value = data.insulinUnits;
            document.getElementById("sugar-date").value = data.sugarDate;

            document.getElementById("log-hour").value = data.logTime ? data.logTime.split(":")[0] : "";
            document.getElementById("log-minute").value = data.logTime ? data.logTime.split(":")[1].split(" ")[0] : "";
            document.getElementById("log-period").value = data.logTime ? data.logTime.split(" ")[1] : "";

            //Select correct time of day
            const timeButtons = document.querySelectorAll(".time-btn");
            timeButtons.forEach(btn => {
                if (btn.getAttribute("data-time") === data.selectedTime) {
                    btn.classList.add("selected");
                } else {
                    btn.classList.remove("selected");
                }
            });

            editMode = true;
            editLogId = id;

            document.getElementById("log-form").style.display = "block";
        }
      
    });

    return card;
}

