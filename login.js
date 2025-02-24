import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // Redirect to dashboard or wherever you need
                console.log("Logged in successfully:", user);
                window.location.href = '/dashboard.html'; // Modify as necessary
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error logging in:", errorCode, errorMessage);
                // Optionally display error messages to the user
            });
    });
});
