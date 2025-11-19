// Weekly To-Do web app
// Stores data in localStorage keyed by calendar date (YYYY-MM-DD).

const STORAGE_KEY = 'weekly_todo_data_v1';

let currentMonday = getMonday(new Date());
let tasksByDate = loadFromStorage();

document.addEventListener('DOMContentLoaded', () => {
  setupControls();
  setupDayForms();
  refreshWeek();
});

function setupControls() {
  document.getElementById('prev-week').addEventListener('click', () => {
    currentMonday = addDays(currentMonday, -7);
    refreshWeek();
  });

  document.getElementById('next-week').addEventListener('click', () => {
    currentMonday = addDays(currentMonday, 7);
    refreshWeek();
  });

  document.getElementById('this-week').addEventListener('click', () => {
    currentMonday = getMonday(new Date());
    refreshWeek();
  });
}

function setupDayForms() {
  const dayColumns = document.querySelectorAll('.day-column');

  dayColumns.forEach((column) => {
    const dayIndex = parseInt(column.dataset.dayIndex, 10);
    const form = column.querySelector('.task-form');
    const input = column.querySelector('.task-input');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const date = addDays(currentMonday, dayIndex);
      const dateKey = toDateKey(date);
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push({
        text,
        completed: false
      });
      saveToStorage();
      input.value = '';
      refreshDay(dayIndex);
    });
  });
}

// ---- Week / day rendering ----

function refreshWeek() {
  updateWeekLabel();
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    refreshDay(dayIndex);
  }
}

function refreshDay(dayIndex) {
  const date = addDays(currentMonday, dayIndex);
  const dateKey = toDateKey(date);
  const column = document.querySelector(`.day-column[data-day-index="${dayIndex}"]`);
  if (!column) return;

  // Update date label
  const dateLabel = column.querySelector('[data-role="date-label"]');
  dateLabel.textContent = formatShortDate(date);

  // Render tasks
  const listEl = column.querySelector('.task-list');
  listEl.innerHTML = '';

  const tasks = tasksByDate[dateKey] || [];
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    const label = document.createElement('span');
    label.textContent = task.text;
    label.className = 'task-label';

    // Toggle complete on click
    label.addEventListener('click', () => {
      tasksByDate[dateKey][index].completed = !tasksByDate[dateKey][index].completed;
      saveToStorage();
      refreshDay(dayIndex);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      tasksByDate[dateKey].splice(index, 1);
      if (tasksByDate[dateKey].length === 0) {
        delete tasksByDate[dateKey];
      }
      saveToStorage();
      refreshDay(dayIndex);
    });

    li.appendChild(label);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}

function updateWeekLabel() {
  const labelEl = document.getElementById('week-label');
  const monday = currentMonday;
  const sunday = addDays(monday, 6);

  const { week, year } = getISOWeek(monday);

  const text = `Week ${week}, ${year} · ${formatLongDate(monday)} – ${formatLongDate(sunday)}`;
  labelEl.textContent = text;
}

// ---- Date helpers ----

function getMonday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day === 0 ? -6 : 1) - day; // shift so that Monday is first
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date, days) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatShortDate(date) {
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function formatLongDate(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// ISO week number algorithm
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday in current week decides the year
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

// ---- Storage helpers ----

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load tasks from localStorage:', err);
  }
  return {};
}

function saveToStorage() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByDate));
  } catch (err) {
    console.warn('Failed to save tasks to localStorage:', err);
  }
}
