// Simple To‑Do app – handles add, edit, delete, complete and persistence via localStorage

const form = document.getElementById('task-form');
const input = document.getElementById('new-task');
const list = document.getElementById('task-list');

let tasks = [];

// Load tasks from localStorage
function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    try { tasks = JSON.parse(stored); } catch (_) { tasks = []; }
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.completed ? ' completed' : '');
    li.dataset.idx = i;

    const title = document.createElement('span');
    title.textContent = t.text;
    title.style.flex = '1';
    title.style.cursor = 'pointer';
    title.addEventListener('click', () => toggleComplete(i));

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '&#9998;'; // pencil
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      editTask(i);
    });

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '&#10005;'; // cross
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(i);
    });

    actions.append(editBtn, delBtn);
    li.append(title, actions);
    list.appendChild(li);
  });
}

function addTask(text) {
  tasks.push({ text, completed: false });
  saveTasks();
  render();
}

function toggleComplete(idx) {
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks();
  render();
}

function editTask(idx) {
  const newText = prompt('Edit task:', tasks[idx].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[idx].text = newText.trim();
    saveTasks();
    render();
  }
}

function deleteTask(idx) {
  if (confirm('Delete this task?')) {
    tasks.splice(idx, 1);
    saveTasks();
    render();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const txt = input.value.trim();
  if (txt) {
    addTask(txt);
    input.value = '';
    input.focus();
  }
});

// Initialize
loadTasks();
render();
