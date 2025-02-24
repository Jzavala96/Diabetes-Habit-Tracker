document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // ✅ Get Firebase Auth from the global window object
        const auth = window.firebaseAuth;

        try {
            // ✅ Sign in user with Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log("Logged in successfully:", user);

            // ✅ Redirect to dashboard (Modify URL as needed)
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Error logging in:", error.code, error.message);
            alert("Login failed: " + error.message);
        }
    });
});
