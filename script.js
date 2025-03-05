document.addEventListener("DOMContentLoaded", function () {
    const addEntryBtn = document.getElementById("addEntryBtn");
    const entryFormContainer = document.getElementById("entryFormContainer");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const journalForm = document.getElementById("journalForm");
    const entriesContainer = document.getElementById("entriesContainer");
    const imageUpload = document.getElementById("imageUpload");

    loadEntries();

    // Toggle Entry Form
    addEntryBtn.addEventListener("click", function () {
        entryFormContainer.classList.toggle("d-none");
    });

    closeFormBtn.addEventListener("click", function () {
        entryFormContainer.classList.add("d-none");
    });

    // Handle form submission
    journalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const subject = document.getElementById("subject").value;
        const entryDateTime = document.getElementById("entryDateTime").value;
        const entryText = document.getElementById("entryText").value;
        const mediaFiles = imageUpload.files;

        if (!subject || !entryDateTime || !entryText) {
            alert("Please fill in all fields before saving.");
            return;
        }

        let mediaUrls = [];
        if (mediaFiles.length > 0) {
            for (let file of mediaFiles) {
                mediaUrls.push(URL.createObjectURL(file));
            }
        }

        const newEntry = { subject, entryDateTime, entryText, mediaUrls };
        saveEntry(newEntry);
        displayEntry(newEntry);

        journalForm.reset();
        entryFormContainer.classList.add("d-none");
    });

    function saveEntry(entry) {
        let entries = JSON.parse(localStorage.getItem("entries")) || [];
        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));
    }

    function loadEntries() {
        let entries = JSON.parse(localStorage.getItem("entries")) || [];
        entries.forEach(displayEntry);
    }

    function displayEntry(entry) {
        const entryElement = document.createElement("div");
        entryElement.classList.add("col-md-6", "col-sm-12", "mb-3");

        entryElement.innerHTML = `
            <div class="card note-card collapsed">
                <div class="card-body">
                    <h5>${entry.subject}</h5>
                    <p>${entry.entryDateTime}</p>
                    <div class="note-content">
                        <p>${entry.entryText}</p>
                        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;

        entriesContainer.appendChild(entryElement);
    }
});
