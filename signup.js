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

        // ✅ Get Firebase Auth from window (Ensures it's initialized)
        const auth = window.firebaseAuth;
        const db = window.firebaseDB;

        if (!auth) {
            console.error("Firebase Auth is not initialized!");
            alert("Firebase is not properly initialized. Try refreshing the page.");
            return;
        }

        try {
            // ✅ Create user in Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log("User created successfully:", user);

            // ✅ Store additional user info in Firestore
            await db.collection("users").doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                uid: user.uid
            });

            console.log("User info saved to Firestore!");
            window.location.href = 'login.html'; // ✅ Redirect to login page

        } catch (error) {
            console.error("Error:", error.message);
            alert("Error: " + error.message);
        }
    });
});
