document.addEventListener("DOMContentLoaded", loadEntries);

// Handle form submission
document.getElementById("journalForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let subject = document.getElementById("subject").value;
    let entryText = document.getElementById("entryText").value;
    let entryDateTime = document.getElementById("entryDateTime").value;
    let mediaInput = document.getElementById("mediaUpload");

    if (!entryDateTime) {
        alert("Please select a date and time for the entry.");
        return;
    }

    let files = mediaInput.files;
    let mediaArray = [];

    let promises = [];

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let reader = new FileReader();

        // Video validation: check duration before saving
        if (file.type.startsWith("video")) {
            let video = document.createElement("video");
            video.preload = "metadata";

            promises.push(
                new Promise((resolve, reject) => {
                    video.onloadedmetadata = function () {
                        window.URL.revokeObjectURL(video.src);
                        if (video.duration > 30) {
                            alert("Video must be 30 seconds or shorter!");
                            reject();
                        } else {
                            reader.onload = function (e) {
                                mediaArray.push({ type: "video", src: e.target.result });
                                resolve();
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    video.src = URL.createObjectURL(file);
                })
            );
        } else {
            // Read images directly
            promises.push(
                new Promise((resolve) => {
                    reader.onload = function (e) {
                        mediaArray.push({ type: "image", src: e.target.result });
                        resolve();
                    };
                    reader.readAsDataURL(file);
                })
            );
        }
    }

    Promise.allSettled(promises).then(() => {
        saveEntry(subject, entryText, entryDateTime, mediaArray);
        document.getElementById("journalForm").reset();
        toggleForm(false);
    });
});

// Save entry to localStorage
function saveEntry(subject, text, dateTime, mediaArray) {
    let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];

    let newEntry = {
        id: Date.now(),
        subject,
        text,
        dateTime,
        media: mediaArray
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
        let mediaHTML = "";
        entry.media.forEach(media => {
            if (media.type === "image") {
                mediaHTML += `<img src="${media.src}" class="note-img" alt="Uploaded Image">`;
            } else if (media.type === "video") {
                mediaHTML += `<video class="note-video" controls><source src="${media.src}" type="video/mp4"></video>`;
            }
        });

        let entryHTML = `
            <div class="col-lg-4 col-md-6 col-12">
                <div class="note-card collapsed" id="entry-${entry.id}" onclick="toggleExpand(${entry.id})">
                    <h5>${entry.subject}</h5>
                    <p><small class="text-muted">${entry.dateTime}</small></p>
                    <div class="note-content" style="display: none;">
                        <p>${entry.text}</p>
                        ${mediaHTML}
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
    event.stopPropagation();

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
