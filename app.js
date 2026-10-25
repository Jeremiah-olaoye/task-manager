// Load saved tasks from LocalStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// Add Task event
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = '';
});

// Render function: creates HTML elements using Bootstrap classes
function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // Create item elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-light' : ''}`;

        const textSpan = document.createElement('span');
        textSpan.className = task.completed ? 'text-decoration-line-through text-muted' : '';
        textSpan.textContent = task.text;

        const actionGroup = document.createElement('div');

        // Complete / Uncheck button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = `btn btn-sm me-2 ${task.completed ? 'btn-outline-warning' : 'btn-outline-success'}`;
        toggleBtn.textContent = task.completed ? 'Uncheck' : 'Complete';
        toggleBtn.onclick = () => toggleTask(task.id);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-outline-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        actionGroup.appendChild(toggleBtn);
        actionGroup.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(actionGroup);

        taskList.appendChild(li);
    });

    // Update Counts
    totalCount.innerText = tasks.length;
    completedCount.innerText = tasks.filter(t => t.completed).length;

    // Update active filter button styling
    ['all', 'active', 'completed'].forEach(filter => {
        const btn = document.getElementById(`btn-${filter}`);
        if (filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Toggle complete status
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// Set active filter
function filterTasks(status) {
    currentFilter = status;
    renderTasks();
}

// Save to LocalStorage and render UI
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Initial render
renderTasks();