const url = 'https://crudcrud.com/api/9c0a5a5da9284fe9b45277a9bfacdf8e/notes';
let notes = []; // Store all notes locally

// Update Total and Showing Counts
function updateCounts() {
  document.getElementById('total-notes').innerText = notes.length;
  document.getElementById('showing-notes').innerText = document.querySelectorAll('.note').length;
}

// Render Notes
function renderNotes(filteredNotes = notes) {
  const notesContainer = document.getElementById('notes');
  notesContainer.innerHTML = ''; // Clear existing notes

  filteredNotes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <button onclick="handleEdit('${note._id}')">Edit</button>
      <button onclick="handleDelete('${note._id}')">Delete</button>
    `;
    notesContainer.appendChild(noteDiv);
  });

  updateCounts();
}

// Fetch Notes on Load
async function fetchNotes() {
  try {
    const response = await axios.get(url);
    notes = response.data;
    renderNotes();
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

// Add Note
async function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  const newNote = { title, description };

  try {
    const response = await axios.post(url, newNote);
    notes.push(response.data);
    renderNotes();
    event.target.reset();
  } catch (error) {
    console.error('Error adding note:', error);
  }
}

// Delete Note
async function handleDelete(id) {
  try {
    await axios.delete(`${url}/${id}`);
    notes = notes.filter(note => note._id !== id);
    renderNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
  }
}

// Edit Note
async function handleEdit(id) {
  const note = notes.find(note => note._id === id);

  document.getElementById('title').value = note.title;
  document.getElementById('description').value = note.description;

  await handleDelete(id); // Remove the old note first
}

// Search Notes
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm) ||
    note.description.toLowerCase().includes(searchTerm)
  );
  renderNotes(filteredNotes);
}

// Initialize Notes on Load
fetchNotes();
