// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Retrieve tasks from Local Storage
    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    // Save tasks to Local Storage
    function setStoredTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a task element (li) with a remove button
    function createTaskElement(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');

        // Remove button functionality
        removeButton.onclick = function () {
            taskList.removeChild(li);

            // Update Local Storage after removal
            const storedTasks = getStoredTasks();
            const updatedTasks = storedTasks.filter(task => task !== taskText);
            setStoredTasks(updatedTasks);
        };

        li.appendChild(removeButton);
        return li;
    }

    // Add a new task to the list
    function addTask(taskTextParam, save = true) {
        // ✅ Explicitly use taskInput.value.trim() as required
        const taskText = taskTextParam ? taskTextParam : taskInput.value.trim();

        // Check if input is empty
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        // Create and append new task element
        const li = createTaskElement(taskText);
        taskList.appendChild(li);

        // Save to Local Storage (only if it's a new task)
        if (save) {
            const storedTasks = getStoredTasks();
            storedTasks.push(taskText);
            setStoredTasks(storedTasks);
        }

        // Clear input field after adding task
        taskInput.value = '';
    }

    // Load all tasks from Local Storage
    function loadTasks() {
        const storedTasks = getStoredTasks();
        storedTasks.forEach(taskText => addTask(taskText, false));
    }

    // Event listener for Add Task button
    addButton.addEventListener('click', function () {
        addTask();
    });

    // Event listener for Enter key press
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Load stored tasks when the page loads
    loadTasks();
});
