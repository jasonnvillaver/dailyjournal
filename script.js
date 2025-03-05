document.addEventListener("DOMContentLoaded", function () {
    const addEntryBtn = document.getElementById("addEntryBtn");
    const entryForm = document.getElementById("entryForm");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const notesContainer = document.getElementById("notesContainer");
    const diaryForm = document.getElementById("diaryForm");

    // Load saved notes when page loads
    loadNotes();

    // Show form when "+" button is clicked
    addEntryBtn.addEventListener("click", function () {
        entryForm.style.display = "block";
    });

    // Close form when "Close" button is clicked
    closeFormBtn.addEventListener("click", function () {
        entryForm.style.display = "none";
    });

    // Save entry when form is submitted
    diaryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        const dateTime = document.getElementById("noteDateTime").value;
        const mediaFiles = document.getElementById("noteMedia").files;
        const mediaArray = [];

        // Handle multiple media files
        Array.from(mediaFiles).forEach(file => {
            const fileType = file.type.split("/")[0];
            if (fileType === "image" || fileType === "video") {
                const fileURL = URL.createObjectURL(file);
                mediaArray.push({ type: fileType, url: fileURL });

                // Check video length (limit to 30 seconds)
                if (fileType === "video") {
                    const video = document.createElement("video");
                    video.src = fileURL;
                    video.preload = "metadata";
                    video.onloadedmetadata = function () {
                        if (video.duration > 30) {
                            alert("Videos must be 30 seconds or shorter.");
                            return;
                        }
                    };
                }
            }
        });

        // Validate input
        if (!title || !content || !dateTime) {
            alert("Please fill out all fields.");
            return;
        }

        // Create new note object
        const newNote = { title, content, dateTime, media: mediaArray };
        saveNote(newNote);
        displayNote(newNote);
        diaryForm.reset();
        entryForm.style.display = "none";
    });

    // Save note to localStorage
    function saveNote(note) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    // Load and display saved notes
    function loadNotes() {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.forEach(displayNote);
    }

    // Display note in UI
    function displayNote(note) {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note-card", "collapsed");
        noteElement.innerHTML = `
            <h5>${note.title}</h5>
            <p>${note.dateTime}</p>
            <div class="note-content">
                <p>${note.content}</p>
                <div class="note-media">
                    ${note.media.map(media => media.type === "image" ?
                        `<img src="${media.url}" class="note-img">` :
                        `<video src="${media.url}" class="note-video" controls></video>`
                    ).join("")}
                </div>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Expand/collapse feature
        noteElement.addEventListener("click", function () {
            this.classList.toggle("collapsed");
            const content = this.querySelector(".note-content");
            const deleteBtn = this.querySelector(".delete-btn");

            if (this.classList.contains("collapsed")) {
                content.style.display = "none";
                deleteBtn.style.display = "none";
            } else {
                content.style.display = "block";
                deleteBtn.style.display = "block";
            }
        });

        // Delete function
        noteElement.querySelector(".delete-btn").addEventListener("click", function (event) {
            event.stopPropagation();
            noteElement.remove();
            deleteNote(note);
        });

        notesContainer.appendChild(noteElement);
    }

    // Delete note from localStorage
    function deleteNote(noteToDelete) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes = notes.filter(note => note.title !== noteToDelete.title || note.content !== noteToDelete.content);
        localStorage.setItem("notes", JSON.stringify(notes));
    }
});
