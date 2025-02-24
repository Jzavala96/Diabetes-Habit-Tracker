import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const confirmEmail = document.getElementById('confirm-email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (email !== confirmEmail) {
            alert("Emails do not match.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const auth = getAuth();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log("User created successfully:", user);
                // Redirect the user to the login page
                window.location.href = 'login.html'; // Redirect to login page
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // Handle Errors here.
                alert("Error: " + errorMessage);
            });
    });
});
