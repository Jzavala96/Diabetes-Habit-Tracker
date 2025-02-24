document.getElementById("sugar-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const sugarLevel = document.getElementById("sugar-level").value;
    const medication = document.getElementById("medication").value;
    const insulinUnits = document.getElementById("insulin-units").value;
    const sugarDate = document.getElementById("sugar-date").value;

    const user = auth.currentUser;

    try {
        await addDoc(collection(db, `logs/${user.uid}/sugar`), {
            level: sugarLevel,
            medication: medication,
            insulin: insulinUnits,
            date: sugarDate
        });

        alert("Sugar log saved!");
        loadLogs(user.uid);
    } catch (error) {
        console.error("Error saving log:", error);
    }
});
