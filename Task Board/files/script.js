(function() {

    // ------------------------ Global variables and eventListeners ------------------------

    // the array of all the notes
    let arrayOfNotesToDisplay = new Array();

    // the array of all the notes in the UI
    let notesContainerInUI = document.getElementById("notes");
    ArrayOfNotesContainerInUI = Array.from(notesContainerInUI.childNodes);

    // "add new note" button on click event listener
    let addNewNoteBtn = document.getElementById("addButton");
    addNewNoteBtn.addEventListener("click", onAddNewNote);

    // "clear fields" button on click event listener
    let clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", clearForm);


    displayNotesInUI();



    // ------------------------ Functions ------------------------ //

    function onAddNewNote() {
        if(validateFormIsNotEmpty() && validateFinishDateIsLegit() && validateFinishTimeIsLegit()) {
            insertNewNoteToLocalStorage();
            clearForm();
        }
    }



    // ------------------------ Model ------------------------ //

    function insertNewNoteToLocalStorage() {
        let todoText = document.getElementById("todoInput");
        let todoTextTrimmed = todoText.value.trim();

        let timeToFinishTask = timeInput.value;
        let dateToFinishTask = dateInput.value;

        // getting the 'notes' object parsed, from the localStorage
        let arrayOfNotesToDisplay = JSON.parse(localStorage.getItem("notes"));

        let noteData = {
            text: todoTextTrimmed,
            time: timeToFinishTask,
            date: dateToFinishTask,
        }

        if (arrayOfNotesToDisplay === null) {
            arrayOfNotesToDisplay = new Array();
        }

        // inserting the note data to the array
        arrayOfNotesToDisplay.push(noteData);

        // saving the array, as as tring, to the localStorage
        localStorage.setItem("notes", JSON.stringify(arrayOfNotesToDisplay));

        displayNotesInUI();
    }

    function onNoteDelete(indexOfNoteToDelete) {
        arrayOfNotesToDisplay.splice(indexOfNoteToDelete, 1);
        localStorage.setItem("notes", JSON.stringify(arrayOfNotesToDisplay));

        displayNotesInUI(true);
    }



    // ------------------------ View ------------------------ //

    function displayNotesInUI(status) {

        arrayOfNotesToDisplay = JSON.parse(localStorage.getItem("notes"));

        // checking if "notes" property exists in the user's localStorage
        if (arrayOfNotesToDisplay !== null) {

            // removing all the notes from the UI container
            notesContainerInUI.innerHTML = "";
    
            // appending the notes from the localstorage to the UI container
            for (let index = 0; index < arrayOfNotesToDisplay.length; index ++) {
                
                let currentNoteText = arrayOfNotesToDisplay[index].text;
                let currentNoteDate = arrayOfNotesToDisplay[index].date;
                let currentNoteTime = arrayOfNotesToDisplay[index].time;

                let newNote = document.createElement("div");
                newNote.classList.add("note");
                
                newNote.innerHTML =
                `<i class="fas fa-trash-alt customBtn deleteButton"></i>
        
                <div class="noteTextArea">
                    <span class="noteText"></span>
                </div>
        
                <div class="noteBottomSection">
                    <p class="noteFinishTime"></p>
                    <p class="noteFinishDate"></p>
                </div>`;

                notesContainerInUI.append(newNote);

                // writing the text, date and time on the note
                writeTextToNote(index, currentNoteText);
                writeDateToNote(index, currentNoteDate);
                writeTimeToNote(index, currentNoteTime);

                // assigning the newly created 'X' button on the note with a Remove function
                assignRemoveFunctionToXbuttons(index);

                // assigning the 'edit note' function
                assignEditNoteFunction(index);
            }
    
            // if an element is removed, don't fade the last one
            if (notesContainerInUI.childNodes.length > 0 && !status) {
                notesContainerInUI.lastChild.classList.add("noteNewest");
            }
        }

        // if the array of notes to be displayed is empty, display an image
        if (arrayOfNotesToDisplay == null || arrayOfNotesToDisplay.length === 0) {
            displayEmptyNoteContainerImage();
        }
    }

    function displayEmptyNoteContainerImage() {
        let emptyNotesImage = document.createElement("img");

        emptyNotesImage.setAttribute("src", "../assets/emptyNotesImage.png");
        emptyNotesImage.classList.add("emptyNotesImage");
        notesContainerInUI.append(emptyNotesImage);
    }

    function clearForm() {
        let todoInput = document.getElementById("todoInput");
        let dateInput = document.getElementById("dateInput");
        let timeInput = document.getElementById("timeInput");

        todoInput.value = "";
        dateInput.value = "";
        timeInput.value = "";

        todoInput.style.border = "";
        todoInput.style.backgroundColor = "";
        dateInput.style.backgroundColor = "";
        timeInput.style.backgroundColor = "";
    }



    // ------------------------ Controller ------------------------ //

    function validateFormIsNotEmpty() {
        let todoText = document.getElementById("todoInput");
        let todoTextTrimmed = todoText.value.trim();

        todoText.style.border = "";
        todoText.style.backgroundColor = "";

        if (todoTextTrimmed === "") {
            todoText.style.border = "3px solid #ff0000d1";
            todoText.style.backgroundColor = "#fd000070";

            // dateInput.value = "";
            // timeInput.value = "";
            dateInput.style.backgroundColor = "";
            timeInput.style.backgroundColor = "";

            return false;
        }

        return true;
    }

    function validateFinishDateIsLegit() {
        // date set to finish task
        let dateToFinishTask = new Date(dateInput.value).setHours(0,0,0,0);
        // current date
        let currentDate = new Date().setHours(0,0,0,0);
        
        dateInput.style.backgroundColor = "";
        timeInput.style.backgroundColor = "";

        if (dateToFinishTask === currentDate) {
            return "today";
        }

        else if (dateToFinishTask > currentDate) {
            return true;
        }

        // if the date entered is earlier than today
        dateInput.style.backgroundColor = "red";
        return false;
    }

    function validateFinishTimeIsLegit() {
        let date = validateFinishDateIsLegit();
        let currentTime = new Date().toTimeString().split(" ");
        let timeToFinishTask = timeInput.value;

        timeInput.style.backgroundColor = "";

        // if the date is today
        if (date === "today") {
            if (timeToFinishTask > currentTime) {
                return true;
            }
        }

        // if the date is greater than today
        else if (date) {
            if (timeToFinishTask !== "") {
                return true;
            }
        }


        // if the time is not valid, return false
        timeInput.style.backgroundColor = "red";
        return false;
    }

    function writeTextToNote(index, currentNoteText) {
        let noteTextArray = document.getElementsByClassName("noteText");
        noteTextArray[index].textContent = currentNoteText;
    }

    function writeDateToNote(index, currentNoteDate) {
        let dateTextArray = document.getElementsByClassName("noteFinishDate");
        dateTextArray[index].textContent = currentNoteDate;
    }

    function writeTimeToNote(index, currentNoteTime) {
        let timeTextArray = document.getElementsByClassName("noteFinishTime");
        timeTextArray[index].textContent = currentNoteTime;
    }

    function assignRemoveFunctionToXbuttons(index) {
        let deleteButtons = document.getElementsByClassName("deleteButton");
        deleteButtons[index].addEventListener("click", () => {
            onNoteDelete(index);
        });
    }

    function assignEditNoteFunction(index) {
        let todoTextInsideNotes = document.getElementsByClassName("noteText");
        todoTextInsideNotes[index].addEventListener("dblclick", function() {

            // when the user double-clicks on the to-do text inside any note, run the following code
            this.innerHTML = "<textarea class='editNoteTextArea'>" + this.textContent + "</textarea>";
            this.addEventListener("keypress", event => {

                if (event.key === 'Enter') {
                    
                    // if the new value entered is not empty
                    if (this.children[0].value.trim() !== "") {
                        // assigning the text entered in the 'textarea' to the note
                        this.textContent = this.children[0].value;

                        // updating the Model (localStorage)
                        arrayOfNotesToDisplay[index].text = this.textContent;
                        localStorage.setItem("notes", JSON.stringify(arrayOfNotesToDisplay));
                    }
                }

            });
        });
    }

})();