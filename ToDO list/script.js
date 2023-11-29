let totalTasks = 0;
let completedTasks = 0;

function addTask() {
    const newTaskInput = document.getElementById('newTask');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('priority');

    if (newTaskInput.value.trim() !== '') {
        const newTask = document.createElement('li');
        newTask.className = `list-group-item priority-${prioritySelect.value}`;
        newTask.innerHTML = `
            <span>${newTaskInput.value}</span>
            <button class="btn btn-success" onclick="completeTask(this)">Complete</button>
            <button class="btn btn-danger" onclick="removeTask(this)">Remove</button>
        `;
        taskList.appendChild(newTask);
        newTaskInput.value = '';
        prioritySelect.value = 'high'; // Reset priority to default after adding a task
        sortTasks(); // Sort tasks after adding a new task
        updateChart(); // Update the completion chart
    }
}

function completeTask(button) {
    const completedTaskList = document.getElementById('completedTaskList');
    const completedTask = button.parentNode;
    completedTask.removeChild(button); // Remove "Complete" button
    completedTaskList.appendChild(completedTask);
    completedTasks += 1; // Increment completedTasks count
    updateChart(); // Update the completion chart
}

function removeTask(button) {
    const task = button.parentNode;
    const taskList = task.parentNode;
    taskList.removeChild(task);
    updateChart(); // Update the completion chart
}

function sortTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children);

    // Sort tasks based on priority (high to low)
    tasks.sort((a, b) => {
        const priorityA = getPriorityLevel(a);
        const priorityB = getPriorityLevel(b);

        return priorityB - priorityA;
    });

    // Remove existing tasks and append them in sorted order
    tasks.forEach(task => taskList.removeChild(task));
    tasks.forEach(task => taskList.appendChild(task));
}

function getPriorityLevel(task) {
    const classList = task.className.split(' ');
    for (const className of classList) {
        if (className.startsWith('priority-')) {
            return getPriorityValue(className);
        }
    }
    return 0; // Default priority if not found
}

function getPriorityValue(className) {
    const priorityMap = {
        'priority-high': 3,
        'priority-medium': 2,
        'priority-low': 1,
    };

    return priorityMap[className] || 0; // Default priority if not found
}

function updateChart() {
    const chartCanvas = document.getElementById('completionChart');
    const ctx = chartCanvas.getContext('2d');

    // Calculate completion percentage
    const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    // Create and update the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Completion Percentage'],
            datasets: [{
                label: 'Task Completion',
                data: [completionPercentage],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
