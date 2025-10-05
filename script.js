// script.js
// Persist To-Do items in localStorage and manipulate the DOM.
// All code runs after DOMContentLoaded to ensure elements exist.

document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Helper: read tasks array from localStorage (returns [] if none)
    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    // Helper: save tasks array to localStorage
    function setStoredTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create DOM elements for a single task and wire the remove behavior.
    // Returns the created <li> element.
    function createTaskElement(taskText) {
        const li = document.createElement('li');

        // Use a span for the text so we can append buttons safely
        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        // Use classList.add as required
        removeButton.classList.add('remove-btn');

        // When clicked, remove the li and update localStorage
        removeButton.onclick = function () {
            // Remove from DOM
            if (li.parentElement === taskList) {
                taskList.removeChild(li);
            }

            // Remove the first matching taskText from stored tasks and save
            const storedTasks = getStoredTasks();
            const index = storedTasks.indexOf(taskText);
            if (index > -1) {
                storedTasks.splice(index, 1);
                setStoredTasks(storedTasks);
            }
        };

        li.appendChild(removeButton);
        return li;
    }

    /**
     * Add a task.
     * @param {string} [taskTextParam] - Optional task text (used when loading from storage).
     * @param {boolean} [save=true] - If true, save to localStorage; set false when populating from storage to avoid duplication.
     */
    function addTask(taskTextParam, save = true) {
        // Determine source for task text: parameter (when loading) or input field (when user adds)
        const sourceText = (typeof taskTextParam === 'string') ? taskTextParam : taskInput.value;
        const taskText = sourceText.trim();

        // If empty and this is a user-triggered add (save===true), alert the user.
        if (taskText === '') {
            if (save) {
                alert('Please enter a task!');
            }
            return;
        }

        // Create and append the task element to the DOM
        const li = createTaskElement(taskText);
        taskList.appendChild(li);

        // If requested, save into localStorage
        if (save) {
            const storedTasks = getStoredTasks();
            storedTasks.push(taskText);
            setStoredTasks(storedTasks);
        }

        // Clear and focus the input field for convenience
        taskInput.value = '';
        taskInput.focus();
    }

    // Load tasks from localStorage and render them
    function loadTasks() {
        const storedTasks = getStoredTasks();
        // When rendering stored tasks, pass save = false to avoid writing them back again
        storedTasks.forEach(taskText => addTask(taskText, false));
    }

    // Event listeners
    addButton.addEventListener('click', function () {
        addTask(); // reads from input and saves to localStorage
    });

    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask(); // allow Enter to add tasks
        }
    });

    // Initialize app by loading saved tasks
    loadTasks();
});
