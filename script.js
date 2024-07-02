document.addEventListener('DOMContentLoaded', loadTasks);
document.querySelector('#task-form').addEventListener('submit', addTask);
document.querySelector('#task-list').addEventListener('click', modifyTask);

function addTask(e) {
    e.preventDefault();
    const taskInput = document.querySelector('#task-input');
    const task = taskInput.value.trim();
    if (task) {
        createTaskElement(task);
        storeTaskInLocalStorage(task);
        taskInput.value = '';
    }
}

function createTaskElement(task, completed = false) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(li));

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(task));

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.appendChild(document.createTextNode('Edit'));
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.appendChild(document.createTextNode('X'));
    li.appendChild(deleteBtn);

    if (completed) {
        li.classList.add('completed');
    }

    document.querySelector('#task-list').appendChild(li);
}

function modifyTask(e) {
    if (e.target.tagName === 'BUTTON') {
        if (e.target.classList.contains('edit-btn')) {
            editTask(e.target.parentElement);
        } else {
            deleteTask(e.target.parentElement);
        }
    }
}

function editTask(taskElement) {
    const newTask = prompt('Edit your task:', taskElement.childNodes[1].textContent);
    if (newTask !== null && newTask.trim() !== '') {
        taskElement.childNodes[1].textContent = newTask.trim();
        updateTaskInLocalStorage(taskElement);
    }
}

function deleteTask(taskElement) {
    if (confirm('Are you sure you want to delete this task?')) {
        taskElement.remove();
        removeTaskFromLocalStorage(taskElement);
    }
}

function toggleTaskCompletion(taskElement) {
    taskElement.classList.toggle('completed');
    updateTaskInLocalStorage(taskElement);
}

function storeTaskInLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskElement) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.task !== taskElement.childNodes[1].textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskElement) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.task === taskElement.childNodes[1].textContent) {
            return { task: taskElement.childNodes[1].textContent, completed: taskElement.classList.contains('completed') };
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.task, task.completed);
    });
}
