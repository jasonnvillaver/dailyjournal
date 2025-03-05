document.addEventListener("DOMContentLoaded", function () {
    const addEntryBtn = document.getElementById("addEntryBtn");
    const entryFormContainer = document.getElementById("entryFormContainer");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const journalForm = document.getElementById("journalForm");
    const entriesContainer = document.getElementById("entriesContainer");
    const imageUpload = document.getElementById("imageUpload");

    // Load saved notes on page load
    loadEntries();

    // Show form when "+" button is clicked
    addEntryBtn.addEventListener("click", function () {
        entryFormContainer.classList.remove("d-none");
    });

    // Hide form when "Cancel" button is clicked
    closeFormBtn.addEventListener("click", function () {
        entryFormContainer.classList.add("d-none");
    });

    // Handle form submission
    journalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const subject = document.getElementById("subject").value;
        const entryDateTime = document.getElementById("entryDateTime").value;
        const entryText = document.getElementById("entryText").value;
        const imageFile = imageUpload.files[0];

        // Validate input fields
        if (!subject || !entryDateTime || !entryText) {
            alert("Please fill in all fields before saving.");
            return;
        }

        let imageUrl = null;
        if (imageFile) {
            imageUrl = URL.createObjectURL(imageFile);
        }

        // Create a new entry object
        const newEntry = { subject, entryDateTime, entryText, imageUrl };

        // Save to local storage
        saveEntry(newEntry);

        // Display the new entry
        displayEntry(newEntry);

        // Reset form and hide it
        journalForm.reset();
        entryFormContainer.classList.add("d-none");
    });

    // Save entry to localStorage
    function saveEntry(entry) {
        let entries = JSON.parse(localStorage.getItem("entries")) || [];
        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));
    }

    // Load entries from localStorage
    function loadEntries() {
        let entries = JSON.parse(localStorage.getItem("entries")) || [];
        entries.forEach(displayEntry);
    }

    // Display a note in the UI
    function displayEntry(entry) {
        const entryElement = document.createElement("div");
        entryElement.classList.add("col-md-6", "mb-3");

        entryElement.innerHTML = `
            <div class="card note-card collapsed">
                <div class="card-body">
                    <h5 class="card-title">${entry.subject}</h5>
                    <p class="card-subtitle text-muted">${entry.entryDateTime}</p>
                    <div class="note-content d-none">
                        <p class="card-text">${entry.entryText}</p>
                        ${entry.imageUrl ? `<img src="${entry.imageUrl}" class="img-fluid note-img mt-2">` : ""}
                        <button class="btn btn-danger btn-sm mt-2 delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;

        // Expand/collapse functionality
        entryElement.querySelector(".card").addEventListener("click", function () {
            const noteContent = this.querySelector(".note-content");
            const deleteBtn = this.querySelector(".delete-btn");

            if (noteContent.classList.contains("d-none")) {
                noteContent.classList.remove("d-none");
                deleteBtn.classList.remove("d-none");
            } else {
                noteContent.classList.add("d-none");
                deleteBtn.classList.add("d-none");
            }
        });

        // Delete functionality
        entryElement.querySelector(".delete-btn").addEventListener("click", function (event) {
            event.stopPropagation();
            entryElement.remove();
            deleteEntry(entry);
        });

        entriesContainer.appendChild(entryElement);
    }

    // Delete entry from localStorage
    function deleteEntry(entryToDelete) {
        let entries = JSON.parse(localStorage.getItem("entries")) || [];
        entries = entries.filter(entry => 
            entry.subject !== entryToDelete.subject || 
            entry.entryText !== entryToDelete.entryText
        );
        localStorage.setItem("entries", JSON.stringify(entries));
    }
});
