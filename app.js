let notes = JSON.parse(localStorage.getItem("notes")) || [];
const notesList = document.getElementById("notesList");
const statusEl = document.getElementById("status");

// Show online/offline
function updateStatus() {
  statusEl.textContent = navigator.onLine ? "✅ Online" : "❌ Offline";
}
window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
updateStatus();

// Save note
function saveNote() {
  const noteInput = document.getElementById("noteInput");
  if (noteInput.value.trim() === "") return;
  const note = {
    text: noteInput.value,
    time: new Date().toLocaleString()
  };
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  noteInput.value = "";
  renderNotes();
}

// Render notes
function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = `${n.text} (${n.time})`;
    notesList.appendChild(li);
  });
}
renderNotes();

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registered"));
}
