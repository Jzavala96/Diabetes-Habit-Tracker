import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    // ✅ Hamburger Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
            document.body.classList.toggle("no-scroll"); 
        });
    }

    // ✅ Sign Out Functionality
    const signOutBtn = document.getElementById("signout-btn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("❌ Error signing out:", error);
            });
        });
    }

    // ✅ Load logs on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadLogs();
        }
    });

    // ✅ Save or Update a Sugar Log
    document.getElementById("sugar-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) return;

        const sugarLevel = document.getElementById("sugar-level").value;
        const sugarDate = document.getElementById("sugar-date").value;
        const logTime = `${document.getElementById("log-hour").value}:${document.getElementById("log-minute").value} ${document.getElementById("log-period").value}`;

        try {
            if (editMode && editLogId) {
                await updateDoc(doc(db, `logs/${user.uid}/sugar`, editLogId), {
                    sugarLevel,
                    sugarDate,
                    logTime
                });
            } else {
                await addDoc(collection(db, `logs/${user.uid}/sugar`), {
                    sugarLevel,
                    sugarDate,
                    logTime
                });
            }

            document.getElementById("sugar-form").reset();
            document.getElementById("log-form").style.display = "none";
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
    logsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, `logs/${user.uid}/sugar`));
    querySnapshot.forEach((doc) => {
        logsContainer.appendChild(createLogCard(doc.id, doc.data()));
    });
}

// ✅ Function to create a log card
function createLogCard(id, data) {
    const card = document.createElement("div");
    card.classList.add("log-card");

    card.innerHTML = `
        <div class="log-header">
            <h3>${data.sugarDate}</h3>
            <button class="delete-btn" data-id="${id}">✖</button>
        </div>
        <p><strong>Sugar Level:</strong> ${data.sugarLevel} mmol/L</p>
        <p><strong>Time:</strong> ${data.logTime}</p>
    `;

    return card;
}
