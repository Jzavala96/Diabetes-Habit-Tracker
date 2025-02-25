import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// ✅ Initialize Firebase services
const db = getFirestore();
const auth = getAuth();

// ✅ Track Edit State & Selected Log ID
let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JavaScript Loaded!");

    // ✅ Show/Hide Add Exercise Form
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");
    const exerciseForm = document.getElementById("exercise-form");

    if (openFormBtn && closeFormBtn && logForm) {
        openFormBtn.addEventListener("click", () => {
            console.log("✅ Add Exercise Clicked!");
            editMode = false;
            editLogId = null;
            exerciseForm.reset();
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

    // ✅ Function to save or update a log
    exerciseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return;

        const workoutDetails = document.getElementById("workout-details").value;
        const workoutHour = document.getElementById("workout-hour").value;
        const workoutMinute = document.getElementById("workout-minute").value;
        const bodyWeight = document.getElementById("body-weight").value;
        const workoutDate = document.getElementById("workout-date").value;
        const intensityLevel = document.getElementById("intensity-level").value;
        const workoutTime = `${workoutHour}h ${workoutMinute}m`;

        try {
            if (editMode && editLogId) {
                // ✅ Update existing log
                await updateDoc(doc(db, `logs/${user.uid}/exercise`, editLogId), {
                    details: workoutDetails,
                    time: workoutTime,
                    date: workoutDate,
                    weight: bodyWeight,
                    intensity: intensityLevel
                });
            } else {
                // ✅ Save new log
                const docRef = await addDoc(collection(db, `logs/${user.uid}/exercise`), {
                    details: workoutDetails,
                    time: workoutTime,
                    date: workoutDate,
                    weight: bodyWeight,
                    intensity: intensityLevel
                });

                document.getElementById("logs-container").prepend(
                    createLogCard(docRef.id, {
                        details: workoutDetails,
                        time: workoutTime,
                        date: workoutDate,
                        weight: bodyWeight,
                        intensity: intensityLevel
                    })
                );
            }

            // ✅ Close form and reset
            exerciseForm.reset();
            logForm.style.display = "none";
            editMode = false;
            editLogId = null;
            loadLogs();
        } catch (error) {
            console.error("❌ Error saving log:", error);
        }
    });
});

// ✅ Function to load logs
async function loadLogs() {
    const user = auth.currentUser;
    if (!user) return;

    const logsContainer = document.getElementById("logs-container");
    logsContainer.innerHTML = ""; // Clear logs before loading new ones

    const querySnapshot = await getDocs(collection(db, `logs/${user.uid}/exercise`));
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
            <button class="delete-btn" data-id="${id}">✖</button>
        </div>
        <p><strong>Details:</strong> ${data.details}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Weight:</strong> ${data.weight} lbs</p>
        <p><strong>Intensity Level:</strong> ${data.intensity}</p>
        <button class="edit-btn" data-id="${id}">Edit</button>
    `;

    // ✅ Delete button functionality
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, `logs/${auth.currentUser.uid}/exercise`, id));
        loadLogs();
    });

    // ✅ Edit button functionality
    card.querySelector(".edit-btn").addEventListener("click", async () => {
        console.log("📝 Edit Clicked!");
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, `logs/${user.uid}/exercise`, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("workout-details").value = data.details;
            document.getElementById("workout-hour").value = data.time.split("h")[0];
            document.getElementById("workout-minute").value = data.time.split("h")[1].split("m")[0];
            document.getElementById("body-weight").value = data.weight;
            document.getElementById("workout-date").value = data.date;
            document.getElementById("intensity-level").value = data.intensity;

            editMode = true;
            editLogId = id;
            document.getElementById("log-form").style.display = "block";
        }
     
    });

    return card;
}
   // ✅ Function to handle sign-out
   document.getElementById("signout-btn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("❌ Error signing out:", error);
    });
});