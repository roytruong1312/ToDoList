// Initialize app data
let categories = [
    { id: 1, name: 'School', tasks: [] },
    { id: 2, name: 'Groceries', tasks: [] }
];

let activeCategory = 1;
let nextTaskId = 1;
let nextCategoryId = 3;

// Login page template
function getLoginTemplate() {
    return `
        <div class="login-container">
            <div class="login-header">
                <h1>MASTERDO</h1>
                <p>Login to manage your tasks</p>
            </div>
            <div class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your username">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password">
                </div>
                <button id="login-btn" class="login-button">Login</button>
                <p id="login-error" style="color: red; display: none; margin-top: 10px;">Invalid username or password</p>
            </div>
        </div>
    `;
}

// Main app template
function getAppTemplate() {
    const user = router.getUser();
    return `
        <div class="app-container">
            <div class="app-header">
                <div class="app-title">MASTERDO</div>
                <div class="user-controls">
                    <span class="user-name">Hello, ${user.username}</span>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                    <div class="status-indicator"></div>
                </div>
            </div>
            
            <div class="stats-container">
                <div class="stat-box">
                    <div class="stat-label">Total Tasks</div>
                    <div class="stat-value" id="total-tasks">0</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Remain</div>
                    <div class="stat-value" id="remaining-tasks">0</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value" id="completed-tasks">0</div>
                </div>
            </div>
            
            <div class="main-content">
                <div class="categories-panel">
                    <div class="panel-header">
                        <div style="display: flex;">
                            <input type="text" class="search-bar" id="category-input" placeholder="Add new category">
                            <button class="btn btn-add" id="add-category-btn">Add</button>
                        </div>
                    </div>
                    <div class="panel-content" id="categories-list">
                        <!-- Categories will be added here -->
                    </div>
                </div>
                
                <div class="tasks-panel">
                    <div class="panel-header">
                        <div style="display: flex;">
                            <input type="text" class="search-bar" id="task-input" placeholder="Add new task">
                            <button class="btn btn-add" id="add-task-btn">Add</button>
                        </div>
                    </div>
                    <div class="panel-content" id="tasks-list">
                        <!-- Tasks will be added here -->
                    </div>
                </div>
            </div>
            
            <div class="analytics-panel">
                <canvas id="analytics-chart"></canvas>
            </div>
        </div>
        
        <div class="overlay" id="modify-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>Modify</h3>
                    <button class="close-btn" id="close-modal">✕</button>
                </div>
                <div class="form-group">
                    <label for="task-name">Name</label>
                    <input type="text" class="form-control" id="task-name">
                </div>
                <div class="form-group">
                    <label for="task-date">Date</label>
                    <input type="date" class="form-control" id="task-date">
                </div>
                <div class="form-group">
                    <label for="task-time">Time</label>
                    <input type="time" class="form-control" id="task-time">
                </div>
                <div class="form-group">
                    <label for="task-reminder">Reminder</label>
                    <input type="time" class="form-control" id="task-reminder">
                </div>
                <button class="save-btn" id="save-task-btn">save</button>
                <input type="hidden" id="edit-task-id">
                <input type="hidden" id="edit-category-id">
            </div>
        </div>
    `;
}

// Initialize the login page
function initLoginPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = getLoginTemplate();
    
    // Setup event listener for login button
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        if (!router.login(username, password)) {
            loginError.style.display = 'block';
        }
    });
    
    // Also login on Enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if (!router.login(username, password)) {
                loginError.style.display = 'block';
            }
        }
    });
}

// Initialize the main app
function initMainApp() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = getAppTemplate();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        router.logout();
    });
    
    loadAppData();
    initAppFunctionality();
}

// Load app data for the current user
function loadAppData() {
    const user = router.getUser();
    if (!user) return;
    
    const savedData = localStorage.getItem(`masterdo-data-${user.username}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        categories = data.categories;
        activeCategory = data.activeCategory;
        nextTaskId = data.nextTaskId;
        nextCategoryId = data.nextCategoryId;
    } else {
        // Default categories and sample tasks for new users
        categories = [
            { id: 1, name: 'School', tasks: [] },
            { id: 2, name: 'Groceries', tasks: [] }
        ];
        
        categories[0].tasks.push({
            id: nextTaskId++,
            name: 'Complete homework',
            completed: false,
            date: getTodayDate(),
            time: '',
            reminder: ''
        });
        
        categories[1].tasks.push({
            id: nextTaskId++,
            name: 'Buy milk',
            completed: false,
            date: getTodayDate(),
            time: '',
            reminder: ''
        });
    }
}

// Save app data for the current user
function saveAppData() {
    const user = router.getUser();
    if (!user) return;
    
    const data = {
        categories,
        activeCategory,
        nextTaskId,
        nextCategoryId
    };
    
    localStorage.setItem(`masterdo-data-${user.username}`, JSON.stringify(data));
}

// Initialize app functionality
function initAppFunctionality() {
    // DOM elements
    const categoriesList = document.getElementById('categories-list');
    const tasksList = document.getElementById('tasks-list');
    const categoryInput = document.getElementById('category-input');
    const taskInput = document.getElementById('task-input');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addTaskBtn = document.getElementById('add-task-btn');
    const modifyOverlay = document.getElementById('modify-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const totalTasksEl = document.getElementById('total-tasks');
    const remainingTasksEl = document.getElementById('remaining-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');

    // Task modification form elements
    const taskNameInput = document.getElementById('task-name');
    const taskDateInput = document.getElementById('task-date');
    const taskTimeInput = document.getElementById('task-time');
    const taskReminderInput = document.getElementById('task-reminder');
    const editTaskId = document.getElementById('edit-task-id');
    const editCategoryId = document.getElementById('edit-category-id');

    // Chart setup
    const ctx = document.getElementById('analytics-chart').getContext('2d');
    let analyticsChart;
    
    // Render UI elements
    renderCategories();
    renderTasks();
    updateStats();
    initChart();
    
    // Set up event listeners
    addCategoryBtn.addEventListener('click', addCategory);
    addTaskBtn.addEventListener('click', addTask);
    closeModalBtn.addEventListener('click', () => {
        modifyOverlay.style.display = 'none';
    });
    saveTaskBtn.addEventListener('click', saveTaskChanges);
    
    // Add event listener for Enter key
    categoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCategory();
    });
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Render the categories list
    function renderCategories() {
        categoriesList.innerHTML = '';
        
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            if (category.id === activeCategory) {
                categoryItem.classList.add('active');
            }
            
            categoryItem.innerHTML = `
                <div>${category.name}</div>
                <div>
                    <button class="btn btn-delete" data-id="${category.id}">Del</button>
                </div>
            `;
            
            categoriesList.appendChild(categoryItem);
            
            // Add click event to select category
            categoryItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-delete')) {
                    activeCategory = category.id;
                    renderCategories();
                    renderTasks();
                    updateStats();
                }
            });
            
            // Add delete button event
            const deleteBtn = categoryItem.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => {
                if (categories.length > 1) {
                    categories = categories.filter(c => c.id !== category.id);
                    if (activeCategory === category.id) {
                        activeCategory = categories[0].id;
                    }
                    renderCategories();
                    renderTasks();
                    updateStats();
                    initChart();
                    saveAppData();
                } else {
                    alert('Cannot delete the last category');
                }
            });
        });
    }

    // Render tasks for the active category
    function renderTasks() {
        tasksList.innerHTML = '';
        
        const activeCat = categories.find(c => c.id === activeCategory);
        if (!activeCat) return;
        
        activeCat.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            if (task.completed) {
                taskItem.classList.add('task-completed');
            }
            
            taskItem.innerHTML = `
                <div>
                    <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span>${task.name}</span>
                    ${task.date ? '<small> (' + formatDate(task.date) + ')</small>' : ''}
                    ${task.time ? '<small> at ' + task.time + '</small>' : ''}
                </div>
                <div>
                    <button class="btn btn-modify" data-id="${task.id}">Mod</button>
                    <button class="btn btn-delete" data-id="${task.id}">Del</button>
                </div>
            `;
            
            tasksList.appendChild(taskItem);
            
            // Add event listeners
            const checkbox = taskItem.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
                updateStats();
                initChart();
                saveAppData();
            });
            
            const modifyBtn = taskItem.querySelector('.btn-modify');
            modifyBtn.addEventListener('click', () => {
                openModifyModal(task);
            });
            
            const deleteBtn = taskItem.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => {
                activeCat.tasks = activeCat.tasks.filter(t => t.id !== task.id);
                renderTasks();
                updateStats();
                initChart();
                saveAppData();
            });
        });
    }

    // Add a new category
    function addCategory() {
        const name = categoryInput.value.trim();
        if (name) {
            categories.push({
                id: nextCategoryId++,
                name: name,
                tasks: []
            });
            categoryInput.value = '';
            renderCategories();
            saveAppData();
        }
    }

    // Add a new task
    function addTask() {
        const name = taskInput.value.trim();
        if (name) {
            const activeCat = categories.find(c => c.id === activeCategory);
            if (activeCat) {
                activeCat.tasks.push({
                    id: nextTaskId++,
                    name: name,
                    completed: false,
                    date: getTodayDate(),
                    time: '',
                    reminder: ''
                });
                taskInput.value = '';
                renderTasks();
                updateStats();
                initChart();
                saveAppData();
            }
        }
    }

    // Open the modify task modal
    function openModifyModal(task) {
        editTaskId.value = task.id;
        editCategoryId.value = activeCategory;
        taskNameInput.value = task.name;
        taskDateInput.value = task.date || '';
        taskTimeInput.value = task.time || '';
        taskReminderInput.value = task.reminder || '';
        
        modifyOverlay.style.display = 'flex';
    }

    // Save task changes
    function saveTaskChanges() {
        const taskId = parseInt(editTaskId.value);
        const categoryId = parseInt(editCategoryId.value);
        
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;
        
        const task = category.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        task.name = taskNameInput.value.trim();
        task.date = taskDateInput.value;
        task.time = taskTimeInput.value;
        task.reminder = taskReminderInput.value;
        
        modifyOverlay.style.display = 'none';
        renderTasks();
        updateStats();
        saveAppData();
    }

    // Update statistics
    function updateStats() {
        let totalTasks = 0;
        let completedTasks = 0;
        
        categories.forEach(category => {
            totalTasks += category.tasks.length;
            completedTasks += category.tasks.filter(task => task.completed).length;
        });
        
        const remainingTasks = totalTasks - completedTasks;
        
        totalTasksEl.textContent = totalTasks;
        remainingTasksEl.textContent = remainingTasks;
        completedTasksEl.textContent = completedTasks;
    }

    // Initialize the analytics chart
    function initChart() {
        // Destroy existing chart if it exists
        if (analyticsChart) {
            analyticsChart.destroy();
        }
        
        analyticsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(category => category.name),
                datasets: [{
                    label: 'Completion Rate (%)',
                    data: getCategoryCompletionRates(),
                    backgroundColor: 'rgba(255, 159, 64, 0.8)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Tasks'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Completion by Category'
                    }
                }
            }
        });
    }

    // Get category completion rates for the chart
    function getCategoryCompletionRates() {
        return categories.map(category => {
            const totalTasks = category.tasks.length;
            if (totalTasks === 0) return 0;
            
            const completedTasks = category.tasks.filter(task => task.completed).length;
            return Math.round((completedTasks / totalTasks) * 100);
        });
    }
}

// Helper functions
function getTodayDate() {
    const today = new Date();
    return formatDateYMD(today);
}

function formatDateYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
}

// Setup routes
router.add('#login', initLoginPage)
      .add('#app', initMainApp);

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    router.init();
});