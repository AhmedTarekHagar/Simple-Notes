// inputs

let noteTitleInput = document.getElementById('title');
let noteTypeInput = document.getElementById('type');
let noteContentSection = document.getElementById('noteContent');

// html elements

let listItem = `<input placeholder="List item" type="text" class="listItem form-control bg-dark text-light focus-ring focus-ring-dark mb-2">`
let listItemElement = `<div id="listItemsContainer">${listItem}</div>
<button type="button" id="addListItemButton" class="btn btn-dark d-block ms-auto"><i class="fa-regular fa-add"></i></button>`;

// global elements
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
}

displayNotes();

function addNote() {
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
    }

    document.getElementById('search').classList.remove('d-none');
    notesList.push(note);
    addToLocalStorage();
    displayNotes();
    clearForm();
}

document.getElementById('addNote').addEventListener('click', addNote);

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
        <div class="position-relative note p-3 bg-warning">
          <div class="position-absolute top-0 end-0">
            <button class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
            <button class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
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
            <div class="position-relative note p-3 bg-warning">
              <div class="position-absolute top-0 end-0">
                <button class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                <button class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
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
            <div class="position-relative note p-3 bg-warning">
              <div class="position-absolute top-0 end-0">
                <button class="updateButton btn text-secondary" type="button"><i class="fa-regular fa-edit"></i></button>
                <button class="deleteButton btn text-danger" type="button"><i class="fa-regular fa-trash-can"></i></button>
              </div>
              <h5 class="text-secondary">${notesList[i].title}</h5>
              <ul>`
                for (let k = 0; k < notesList[i].content.length; k++) {
                    content += `<li>${notesList[i].content[k]}</li>`;
                }
                content += `</ul>
            </div>
          </div>
                `;
            }
        }
    }

    if (content == ``) {
        document.getElementById('search').classList.add('d-none');
        content = `
        <div class="col-12">
            <div class="position-relative note p-3 bg-warning text-center text-danger fs-1 fw-bold">
              No notes
            </div>
          </div>
        `;
    }

    document.getElementById('notes').innerHTML = content;

    addEventListenersToDeleteAndUpdateButtons();
}


function addEventListenersToDeleteAndUpdateButtons() {
    let updateButtons = document.querySelectorAll('.updateButton');
    updateButtons.forEach((button, index) => {
        button.addEventListener('click', function (event) {
            updateNote(index);
        });
    });

    let deleteButtons = document.querySelectorAll('.deleteButton');
    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', function (event) {
            deleteNote(index);
        });
    });
}




function deleteNote(index) {
    notesList.splice(index,1);
    addToLocalStorage();
    displayNotes();
}

function updateNote(index) {
    console.log('update fired for index' + index);
    displayNotes();
}