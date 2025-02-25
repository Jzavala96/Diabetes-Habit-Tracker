import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded!");

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            console.log("Menu Toggled");
            navMenu.classList.toggle("show");
            document.body.classList.toggle("no-scroll"); 
        });
    } else {
        console.error("ERROR: Menu toggle button or nav menu not found.");
    }

    //Sign Out Button
    const signOutBtn = document.getElementById("signout-btn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("Error signing out:", error);
            });
        });
    } else {
        console.error("Sign-out button not found!");
    }

    // Show/Hide Add Exercise Form
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");
    const exerciseForm = document.getElementById("exercise-form");

    if (openFormBtn && closeFormBtn && logForm) {
        openFormBtn.addEventListener("click", () => {
            console.log("Add Exercise Clicked!");
            editMode = false;
            editLogId = null;
            exerciseForm.reset();

            //Ensure form is visible
            logForm.classList.remove("hidden");
            logForm.style.display = "block";
        });

        closeFormBtn.addEventListener("click", () => {
            console.log("Cancel Clicked!");
            logForm.classList.add("hidden");
            logForm.style.display = "none";
        });
    } else {
        console.error("ERROR: Form elements not found!");
    }

    //Load logs on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });

    //Save or update a log
    if (exerciseForm) {
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
                    await updateDoc(doc(db, `logs/${user.uid}/exercise`, editLogId), {
                        details: workoutDetails,
                        time: workoutTime,
                        date: workoutDate,
                        weight: bodyWeight,
                        intensity: intensityLevel
                    });
                } else {
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

                exerciseForm.reset();
                logForm.style.display = "none";
                editMode = false;
                editLogId = null;
                loadLogs();
            } catch (error) {
                console.error("Error saving log:", error);
            }
        });
    } else {
        console.error("ERROR: Exercise form not found!");
    }
});

async function loadLogs() {
    const user = auth.currentUser;
    if (!user) return;

    const logsContainer = document.getElementById("logs-container");
    if (!logsContainer) {
        console.error("ERROR: Logs container not found.");
        return;
    }

    logsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, `logs/${user.uid}/exercise`));
    querySnapshot.forEach((doc) => {
        logsContainer.appendChild(createLogCard(doc.id, doc.data()));
    });
}

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

    //Delete button 
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, `logs/${auth.currentUser.uid}/exercise`, id));
        loadLogs();
    });

    return card;
}

