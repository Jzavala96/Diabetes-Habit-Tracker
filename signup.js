document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    
    signupForm.addEventListener('submit', async function(e) {
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

        // ✅ Get Firebase Auth and Firestore
        const auth = window.firebaseAuth;
        const db = window.firebaseDB;

        try {
            // ✅ Create user
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log("User created:", user);

            // ✅ Store additional user info
            await db.collection("users").doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                uid: user.uid
            });

            console.log("User info saved to Firestore!");
            window.location.href = 'login.html'; // Redirect to login

        } catch (error) {
            console.error("Error:", error.message);
            alert("Error: " + error.message);
        }
    });
});
