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

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  installBtn.style.display = "none";
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("User choice:", outcome);
  deferredPrompt = null;
});

const BACKEND_URL = "https://backend-note-pwa-1.onrender.com/";

// Fetch all notes from backend
async function syncData() {
  const response = await fetch(BACKEND_URL);
  const data = await response.json();
  console.log("Synced data:", data);
}

// Save note to backend
async function saveData(note) {
  await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
}

