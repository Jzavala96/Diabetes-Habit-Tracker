import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// ✅ Initialize Firebase services
const db = getFirestore();
const auth = getAuth();

// ✅ Track Edit State & Selected Log ID
let editMode = false;
let editLogId = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JavaScript Loaded!");

    // ✅ Hamburger Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
            document.body.classList.toggle("no-scroll");
        });
    } else {
        console.error("❌ ERROR: Menu toggle button or nav menu not found.");
    }

    // ✅ Sign-Out Functionality
    const signOutBtn = document.querySelector(".signout-btn");
    if (signOutBtn) {
        signOutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("❌ Error signing out:", error);
            });
        });
    }

    // ✅ Show/Hide Add Exercise Form
    const openFormBtn = document.getElementById("open-form-btn");
    const closeFormBtn = document.getElementById("close-form-btn");
    const logForm = document.getElementById("log-form");
    const exerciseForm = document.getElementById("exercise-form");

    if (openFormBtn && closeFormBtn && logForm) {
        openFormBtn.addEventListener("click", () => {
            editMode = false;
            editLogId = null;
            exerciseForm.reset();
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
});
