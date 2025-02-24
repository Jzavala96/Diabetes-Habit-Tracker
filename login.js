document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // ✅ Get Firebase Auth from window
        const auth = window.firebaseAuth;

        if (!auth) {
            console.error("Firebase Auth is not initialized!");
            alert("Firebase is not properly initialized. Try refreshing the page.");
            return;
        }

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Logged in:", userCredential.user);
            window.location.href = 'dashboard.html'; // ✅ Redirect on success
        } catch (error) {
            console.error("Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });
});
