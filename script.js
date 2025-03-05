document.addEventListener("DOMContentLoaded", loadEntries);

// Handle form submission
document.getElementById("journalForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let subject = document.getElementById("subject").value;
    let entryText = document.getElementById("entryText").value;
    let entryDateTime = document.getElementById("entryDateTime").value;
    let imageInput = document.getElementById("imageUpload");

    if (!entryDateTime) {
        alert("Please select a date and time for the entry.");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e) {
        let imageSrc = e.target.result;
        saveEntry(subject, entryText, entryDateTime, imageSrc);
    };

    if (imageInput.files.length > 0) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveEntry(subject, entryText, entryDateTime, null);
    }

    document.getElementById("journalForm").reset();
    toggleForm(false);
});

// Save entry to localStorage
function saveEntry(subject, text, dateTime, imageSrc) {
    let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];

    let newEntry = {
        id: Date.now(),
        subject,
        text,
        dateTime,
        imageSrc
    };

    entries.unshift(newEntry);
    localStorage.setItem("diaryEntries", JSON.stringify(entries));

    displayEntries();
}

// Load and display entries
function loadEntries() {
    displayEntries();
}

// Display entries in collapsed form
function displayEntries() {
    let container = document.getElementById("entriesContainer");
    container.innerHTML = "";

    let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];

    entries.forEach(entry => {
        let entryHTML = `
            <div class="col-md-4">
                <div class="note-card collapsed" id="entry-${entry.id}" onclick="toggleExpand(${entry.id})">
                    <h5>${entry.subject}</h5>
                    <p><small class="text-muted">${entry.dateTime}</small></p>
                    <div class="note-content" style="display: none;">
                        <p>${entry.text}</p>
                        ${entry.imageSrc ? `<img src="${entry.imageSrc}" class="note-img" alt="Note Image">` : ""}
                        <button class="btn btn-danger btn-sm mt-2 delete-btn" onclick="deleteEntry(${entry.id}, event)" style="display: none;">Delete</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += entryHTML;
    });
}

// Toggle note expansion
function toggleExpand(entryId) {
    let entry = document.getElementById(`entry-${entryId}`);
    let content = entry.querySelector(".note-content");
    let deleteBtn = entry.querySelector(".delete-btn");

    if (entry.classList.contains("collapsed")) {
        content.style.display = "block";
        deleteBtn.style.display = "inline-block";
        entry.classList.remove("collapsed");
    } else {
        content.style.display = "none";
        deleteBtn.style.display = "none";
        entry.classList.add("collapsed");
    }
}

// Delete entry
function deleteEntry(entryId, event) {
    event.stopPropagation(); // Prevent note from toggling when clicking delete

    let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    entries = entries.filter(entry => entry.id !== entryId);
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
    displayEntries();
}

// Form Toggle Functions
document.getElementById("addEntryBtn").addEventListener("click", () => toggleForm(true));
document.getElementById("closeFormBtn").addEventListener("click", () => toggleForm(false));

function toggleForm(show) {
    let formContainer = document.getElementById("entryFormContainer");
    if (show) {
        formContainer.classList.remove("d-none");
    } else {
        formContainer.classList.add("d-none");
    }
}
