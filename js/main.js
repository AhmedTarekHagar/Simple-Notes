// inputs
let noteTitleInput = document.getElementById('title');
let noteTypeInput = document.getElementById('type');
let noteContentSection = document.getElementById('noteContent');
let addOrUpdateButton = document.getElementById('addOrUpdateNote');
let searchInput = document.getElementById('search');

// html elements
let listItem = `<input placeholder="List item" type="text" class="listItem form-control bg-dark text-light focus-ring focus-ring-dark mb-2">`
let listItemElement = `<div id="listItemsContainer">${listItem}</div>
<button type="button" id="addListItemButton" class="btn btn-dark d-block ms-auto"><i class="fa-regular fa-add"></i></button>`;

// global variables
let globalIndex;

// adding event listeners to manipulate DOM
noteTypeInput.addEventListener('change', function () {
    if (noteTypeInput.value == 'text') {

        document.getElementById('listType').innerHTML = ``;
        noteContentSection.innerHTML = `
        <label class="form-label" for="content">Note Content:</label>
        <textarea class="form-control focus-ring focus-ring-dark" rows="5" id="content"></textarea>`;

    } else if (noteTypeInput.value == 'list') {
        document.getElementById('listType').innerHTML = `<div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="checkBox">
        <label class="form-check-label" for="checkBox">Numbered?</label>
        </div>`;

        noteContentSection.innerHTML = listItemElement;

        document.getElementById('addListItemButton').addEventListener('click', addNewListItem);
    }
});

function addNewListItem() {
    let newListItem = document.createElement('input');
    newListItem.setAttribute('placeholder', 'List item');
    newListItem.setAttribute('type', 'text');
    newListItem.classList.add('listItem', 'form-control', 'bg-dark', 'text-light', 'focus-ring', 'focus-ring-dark', 'mb-2');

    document.getElementById('listItemsContainer').appendChild(newListItem);
}

let notesList = [];

if (localStorage.getItem('notes') != null) {
    notesList = JSON.parse(localStorage.getItem('notes'));
    searchInput.classList.remove('d-none');
}

displayNotes();

function addOrUpdateNote() {
    let note = {};
    if (noteTypeInput.value == 'text') {
        note = {
            title: noteTitleInput.value,
            type: noteTypeInput.value,
            content: document.getElementById('content').value
        }
    } else if (noteTypeInput.value == 'list') {
        let listItems = [];
        Array.from(document.querySelectorAll('.listItem')).forEach(item => {
            listItems.push(item.value);
        });
        note = {
            title: noteTitleInput.value,
            type: noteTypeInput.value,
            numbered: document.getElementById('checkBox').checked,
            content: listItems
        }
    } else {
        note = {
            title: noteTitleInput.value
        }
    }
    if (addOrUpdateButton.innerHTML == `Add Note`) {
        notesList.push(note);
    } else if (addOrUpdateButton.innerHTML == `Update Note`) {
        notesList.splice(globalIndex, 1, note);
        addOrUpdateButton.innerHTML = 'Add Note';
        addOrUpdateButton.classList.add('btn-outline-light');
        addOrUpdateButton.classList.remove('btn-outline-warning');
    }

    addToLocalStorage();
    displayNotes();
    clearForm();
}

addOrUpdateButton.addEventListener('click', addOrUpdateNote);

function addToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notesList));
}

function clearForm() {
    noteTitleInput.value = ``;
    noteTypeInput.value = ``;
    noteContentSection.innerHTML = ``;
    document.getElementById('listType').innerHTML = ``;
}

function displayNotes() {
    let content = ``;

    for (i = 0; i < notesList.length; i++) {
        if (notesList[i].type == 'text') {
            content += `
            <div class="col-md-3">
        <div class="position-relative note p-3 bg-warning shadow">
          <div class="position-absolute bottom-0 end-0">
            <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
            <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
            <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
          </div>
          <h5 class="text-secondary">${notesList[i].title}</h5>
          <p>${notesList[i].content}</p>
        </div>
      </div>
            `;
        } else if (notesList[i].type == 'list') {
            if (notesList[i].numbered) {
                content += `
                <div class="col-md-3">
            <div class="position-relative note p-3 bg-warning shadow">
              <div class="position-absolute bottom-0 end-0">
                <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
              </div>
              <h5 class="text-secondary">${notesList[i].title}</h5>
              <ol>`
                for (let j = 0; j < notesList[i].content.length; j++) {
                    content += `<li>${notesList[i].content[j]}</li>`;
                }
                content += `</ol>
            </div>
          </div>
                `;
            } else {
                content += `
                <div class="col-md-3">
            <div class="position-relative note p-3 bg-warning shadow">
              <div class="position-absolute bottom-0 end-0">
                <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
              </div>
              <h5 class="text-secondary">${notesList[i].title}</h5>
              <ul>`
                for (let j = 0; j < notesList[i].content.length; j++) {
                    content += `<li>${notesList[i].content[j]}</li>`;
                }
                content += `</ul>
            </div>
          </div>
                `;
            }
        } else {
            content += `
                        <div class="col-md-3">
                            <div class="position-relative note p-3 bg-warning shadow">
                            <div class="position-absolute bottom-0 end-0">
                                <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                                <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                                <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                            <h5 class="text-secondary">${notesList[i].title}</h5>
                            <p class="text-uppercase text-danger fw-bold">no Content to this note</p>
                            </div>
                        </div>
            `;
        }
    }

    if (content == ``) {
        content = `
        <div class="col-12">
            <div class="position-relative note p-3 bg-warning text-center text-danger fs-1 fw-bold shadow-lg">
              No Notes Added
            </div>
          </div>
        `;
    }

    document.getElementById('notes').innerHTML = content;

    addEventListenersToDeleteAndUpdateAndCopyButtons();
}

function addEventListenersToDeleteAndUpdateAndCopyButtons() {
    let updateButtons = document.querySelectorAll('.updateButton');
    updateButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            updateNote(index);
        });
    });

    let deleteButtons = document.querySelectorAll('.deleteButton');
    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            deleteNote(index);
        });
    });

    let copyButtons = document.querySelectorAll('.copyButton');
    copyButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            copyNote(index);
        });
    });
}

function deleteNote(index) {
    notesList.splice(index, 1);
    addToLocalStorage();
    displayNotes();
}

function updateNote(index) {
    globalIndex = index;
    addOrUpdateButton.innerHTML = 'Update Note';
    addOrUpdateButton.classList.remove('btn-outline-light');
    addOrUpdateButton.classList.add('btn-outline-warning');

    noteTitleInput.value = notesList[index].title;
    noteTypeInput.value = notesList[index].type;
    if (notesList[index].type == 'text') {
        document.getElementById('listType').innerHTML = ``;
        noteContentSection.innerHTML = `
        <label class="form-label" for="content">Note Content:</label>
        <textarea class="form-control focus-ring focus-ring-dark" rows="5" id="content">${notesList[index].content}</textarea>`;
    } else if (notesList[index].type == 'list') {
        noteTypeInput.value = notesList[index].type;
        document.getElementById('listType').innerHTML = `<div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="checkBox">
        <label class="form-check-label" for="checkBox">Numbered?</label>
        </div>`;
        document.getElementById('checkBox').checked = notesList[index].numbered;
        ListContent = ``;
        for (i = 0; i < notesList[index].content.length; i++) {
            ListContent += `<input value="${notesList[index].content[i]}" placeholder="List item" type="text" class="listItem form-control bg-dark text-light focus-ring focus-ring-dark mb-2">`
        }
        noteContentSection.innerHTML = listItemElement;
        document.getElementById('listItemsContainer').innerHTML = ListContent;
        document.getElementById('addListItemButton').addEventListener('click', addNewListItem);
    }
}

function copyNote(index) {
    notesList.splice(index, 0, notesList[index]);
    addToLocalStorage();
    displayNotes();
}

function search() {
    let searchValue = searchInput.value.toLowerCase();
    let content = ``;

    for (i = 0; i < notesList.length; i++) {
        if (notesList[i].title.toLowerCase().includes(searchValue)) {
            if (notesList[i].type == 'text') {
                content += `
                <div class="col-md-3">
            <div class="position-relative note p-3 bg-warning shadow">
              <div class="position-absolute bottom-0 end-0">
                <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
              </div>
              <h5 class="text-secondary">${notesList[i].title.toLowerCase().replace(searchValue, `<span class = "text-light bg-dark px-1 rounded">${searchValue}</span>`)}</h5>
              <p>${notesList[i].content}</p>
            </div>
          </div>
                `;
            } else if (notesList[i].type == 'list') {
                if (notesList[i].numbered) {
                    content += `
                    <div class="col-md-3">
                <div class="position-relative note p-3 bg-warning shadow">
                  <div class="position-absolute bottom-0 end-0">
                    <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                    <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                    <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
                  </div>
                  <h5 class="text-secondary">${notesList[i].title.toLowerCase().replace(searchValue, `<span class = "text-light bg-dark px-1 rounded">${searchValue}</span>`)}</h5>
                  <ol>`
                    for (let j = 0; j < notesList[i].content.length; j++) {
                        content += `<li>${notesList[i].content[j]}</li>`;
                    }
                    content += `</ol>
                </div>
              </div>
                    `;
                } else {
                    content += `
                    <div class="col-md-3">
                <div class="position-relative note p-3 bg-warning shadow">
                  <div class="position-absolute bottom-0 end-0">
                    <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                    <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                    <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
                  </div>
                  <h5 class="text-secondary">${notesList[i].title.toLowerCase().replace(searchValue, `<span class = "text-light bg-dark px-1 rounded">${searchValue}</span>`)}</h5>
                  <ul>`
                    for (let j = 0; j < notesList[i].content.length; j++) {
                        content += `<li>${notesList[i].content[j]}</li>`;
                    }
                    content += `</ul>
                </div>
              </div>
                    `;
                }
            } else {
                content += `
                            <div class="col-md-3">
                                <div class="position-relative note p-3 bg-warning shadow">
                                <div class="position-absolute bottom-0 end-0">
                                    <button title="Dublicate Note" class="copyButton btn text-secondary" type="button"><i class="fa-regular fa-copy"></i></button>
                                    <button title="Edit Note" class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                                    <button title="Delete Note" class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
                                </div>
                                <h5 class="text-secondary">${notesList[i].title.toLowerCase().replace(searchValue, `<span class = "text-light bg-dark px-1 rounded">${searchValue}</span>`)}</h5>
                                <p class="text-uppercase text-danger fw-bold">no Content to this note</p>
                                </div>
                            </div>
                `;
            }
        }
    }

    if (content == ``) {
        content = `
        <div class="col-12">
            <div class="position-relative note p-3 bg-warning text-center text-danger fs-1 fw-bold shadow-lg">
              No Matches
            </div>
          </div>
        `;
    }

    document.getElementById('notes').innerHTML = content;

    addEventListenersToDeleteAndUpdateAndCopyButtons();
}

searchInput.addEventListener('keyup', search);