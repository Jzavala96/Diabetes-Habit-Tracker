import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
            document.body.classList.toggle("no-scroll"); 
        });
    } else {
        console.error("ERROR: Menu toggle button or nav menu not found.");
    }

    //Sign Out
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

    // Meal Selection
    const mealButtons = document.querySelectorAll(".meal-btn");
    const selectedMealInput = document.getElementById("selected-meal");

    mealButtons.forEach(button => {
        button.addEventListener("click", () => {
            mealButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedMealInput.value = button.getAttribute("data-meal");
        });
    });

    // Show/Hide Add Diet Form
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");
    const dietForm = document.getElementById("diet-form");

    if (openFormBtn && closeFormBtn && logForm) {
        openFormBtn.addEventListener("click", () => {
            console.log("Add Diet Clicked!");
            editMode = false;
            editLogId = null;
            dietForm.reset();
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

    // Load logs on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });

    // save or update a log
    dietForm.addEventListener("submit", async (e) => {
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
            alert("Please select a meal type before saving.");
            return;
        }

        try {
            if (editMode && editLogId) {

                await updateDoc(doc(db, `logs/${user.uid}/diet`, editLogId), {
                    details: mealDetails,
                    time: mealTime,
                    date: mealDate,
                    mealType: selectedMeal,
                    snackLabel: snackLabel
                });
            } else {

                const docRef = await addDoc(collection(db, `logs/${user.uid}/diet`), {
                    details: mealDetails,
                    time: mealTime,
                    date: mealDate,
                    mealType: selectedMeal,
                    snackLabel: snackLabel
                });

                document.getElementById("logs-container").prepend(
                    createLogCard(docRef.id, {
                        details: mealDetails,
                        time: mealTime,
                        date: mealDate,
                        mealType: selectedMeal,
                        snackLabel: snackLabel
                    })
                );
            }

            dietForm.reset();
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

    const querySnapshot = await getDocs(collection(db, `logs/${user.uid}/diet`));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        logsContainer.appendChild(createLogCard(doc.id, data));
    });
}

//log card
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
        <p><strong>Meal Type:</strong> ${data.mealType || "Not Specified"}</p>
        <p><strong>Snack Label:</strong> ${data.snackLabel || "None"}</p>
        <button class="edit-btn" data-id="${id}">Edit</button>
    `;

    // Delete button 
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, `logs/${auth.currentUser.uid}/diet`, id));
        loadLogs();
    });

    // Edit button 
    card.querySelector(".edit-btn").addEventListener("click", async () => {
        console.log("📝 Edit Clicked!");

        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, `logs/${user.uid}/diet`, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById("meal-details").value = data.details;
            document.getElementById("meal-hour").value = data.time.split(":")[0];
            document.getElementById("meal-minute").value = data.time.split(":")[1].split(" ")[0];
            document.getElementById("meal-period").value = data.time.split(" ")[1];
            document.getElementById("meal-date").value = data.date;
            document.getElementById("snack-label").value = data.snackLabel || "None";

            //Select meal type button
            const mealButtons = document.querySelectorAll(".meal-btn");
            mealButtons.forEach(btn => {
                if (btn.getAttribute("data-meal") === data.mealType) {
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
