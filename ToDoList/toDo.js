const categoryList = document.getElementById('categoryList');
const taskList = document.getElementById('taskList');
const newCategoryInput = document.getElementById('newCategoryInput');
const addCategoryButton = document.getElementById('addCategoryButton');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskButton = document.getElementById('addTaskButton');

// Task data storage
const tasks = {
    daily: [],
    groceries: [],
    travel: [],
};

// Function to add a new category
addCategoryButton.addEventListener('click', () => {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory !== '') {
        const categoryItem = document.createElement('li');
        categoryItem.classList.add('category-item');
        categoryItem.textContent = newCategory;
        categoryItem.dataset.listId = newCategory.toLowerCase().replace(/\s/g, ''); // Create a unique ID
        categoryList.appendChild(categoryItem);
        newCategoryInput.value = '';
        tasks[newCategory.toLowerCase().replace(/\s/g, '')] = []; // Initialize task list for new category
    }
});

// Function to add a new task
addTaskButton.addEventListener('click', () => {
    const newTask = newTaskInput.value.trim();
    if (newTask !== '') {
        const currentListId = taskList.dataset.listId;
        const taskId = tasks[currentListId].length + 1; // Assign a unique ID to the task
        tasks[currentListId].push({ id: taskId, text: newTask, done: false });
        renderTaskList(currentListId);
        newTaskInput.value = '';
    }
});

// Function to render the task list
function renderTaskList(listId) {
    taskList.innerHTML = '';
    tasks[listId].forEach((task) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.dataset.taskId = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('click', () => {
            task.done = !task.done;
            renderTaskList(listId);
        });
        taskItem.appendChild(checkbox);

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskItem.appendChild(taskText);

        taskList.appendChild(taskItem);
    });

    // Move completed tasks to the end of the list
    const completedTasks = taskList.querySelectorAll('.task-item.done');
    completedTasks.forEach((task) => {
        taskList.appendChild(task);
    });
}

// Event listener for clicking on category items
categoryList.addEventListener('click', (event) => {
    if (event.target.classList.contains('category-item')) {
        // Remove the 'active' class from the previously selected category
        const activeCategory = categoryList.querySelector('.category-item.active');
        if (activeCategory) {
            activeCategory.classList.remove('active');
        }

        // Add the 'active' class to the clicked category
        event.target.classList.add('active');

        // Update the task list based on the selected category
        const listId = event.target.dataset.listId;
        taskList.dataset.listId = listId;
        renderTaskList(listId);
    }
});

// Initialize the task list for the first category
renderTaskList('daily');