document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // ✅ Use Firebase Auth from window
        const auth = window.firebaseAuth;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log("Logged in:", userCredential.user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Error:", error.message);
            alert("Login failed: " + error.message);
        }
    });
});
