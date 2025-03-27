let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let clearBtn;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
}


const show = (elem) => {
  elem.style.display = 'inline';
};


const hide = (elem) => {
  elem.style.display = 'none';
};


let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }

  handleRenderBtns(); 
};



const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };

  
  if (newNote.title && newNote.text) {
    saveNote(newNote).then(() => {
      getAndRenderNotes(); 
      renderActiveNote();  
    });
  } else {
    alert("Both title and text are required to save a note.");
  }
};




const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target.closest('.list-group-item'); 
  const noteId = JSON.parse(note.dataset.note).id; 

  if (activeNote.id === noteId) {
    activeNote = {};
    noteTitle.value = '';  
    noteText.value = '';   
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes(); 
    renderActiveNote(); 
  });
};


const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};


const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();  
};


const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    show(saveNoteBtn); 
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    show(saveNoteBtn); 
  } else {
    show(saveNoteBtn); 
  }
};




const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  
  const createLi = (text, note, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.dataset.note = JSON.stringify(note);

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title, note);
    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};


const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', () => {
    activeNote = {};  
    noteTitle.value = '';  
    noteText.value = '';   
    renderActiveNote();  
  });
  noteForm.addEventListener('input', handleRenderBtns);
  document.querySelector('.list-group').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-note')) {
      handleNoteDelete(e);
    }
  });
}

getAndRenderNotes();