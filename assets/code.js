// 02-Challenge: Task Board (Unsolved Starter)
//
// Use this file to implement:
// - Task creation
// - Task rendering
// - Drag-and-drop across columns
// - Color-coding by due date using Day.js
// - Persistence with localStorage

// ===== State & Initialization =====

// Load tasks and nextId from localStorage (or use defaults)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')) || 1;

// Utility to save tasks + nextId
function saveState() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

// ===== Core Functions (implement these) =====

// TODO: generateTaskId()
// - Return a unique id
// - Increment nextId and persist using saveState()
function generateTaskId() {
    // Your code here

    const id = nextId;
    nextId += 1;
    saveState();
    return id;
}

// TODO: createTaskCard(task)
// - Return a jQuery element representing a task card
// - Include:
//   - Title
//   - Description
//   - Due date
//   - Delete button
// - Add a data-task-id attribute for later lookups
// - Use Day.js to color-code:
//   - If task is not in "done":
//     - Add a warning style if due soon / today
//     - Add an overdue style if past due
function createTaskCard(task) {
    // Your code here
    const today = dayjs().startOf('day');
    const due = dayjs(task.dueDate, 'YYYY-MM-DD').startOf('day');

    // Default card style; we'll add warning/overdue based on date
    let borderClass = 'border border-light';

    if (task.status !== 'done' && due.isValid()) {
        if (due.isBefore(today, 'day')) {
            // Overdue
            borderClass = 'border border-danger';
        } else {
            const diffDays = due.diff(today, 'day');
            if (diffDays <= 2) {
                // Due today / soon
                borderClass = 'border border-warning';
            }
        }
    }

    const formattedDate = due.isValid() ?
        due.format('MMM D, YYYY') :
        task.dueDate;

    const $card = $(`
    <div class="card task-card mb-2 ${borderClass}" data-task-id="${task.id}">
      <div class="card-body py-2 px-3">
        <div class="d-flex justify-content-between align-items-start">
          <div class="me-2">
            <h3 class="h6 mb-1">${task.title}</h3>
            <p class="small mb-1">${task.description || ''}</p>
            <p class="small mb-0 text-muted">
              <strong>Due:</strong> ${formattedDate}
            </p>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger btn-delete"
            data-task-id="${task.id}"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `);

    return $card;
}




// TODO: renderTaskList()
// - Clear all lane containers (#todo-cards, #in-progress-cards, #done-cards)
// - Loop through tasks array
// - For each task, create a card and append it to the correct lane
// - After rendering, make task cards draggable with jQuery UI
function renderTaskList() {
    // Your code here
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    tasks.forEach(task => {
        const $card = createTaskCard(task);

        if (task.status === 'to-do') {
            $('#todo-cards').append($card);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append($card);
        } else if (task.status === 'done') {
            $('#done-cards').append($card);
        }
    });

    $('.task-card').draggable({
        revert: 'invalid',
        zIndex: 100,
        cursor: 'move',
        start: function () {
            $(this).addClass('opacity-50');
        },
        stop: function () {
            $(this).removeClass('opacity-50');
        }
    });


};

// TODO: handleAddTask(event)
// - Prevent default form submission
// - Read values from #taskTitle, #taskDescription, #taskDueDate
// - Validate: if missing, you can show a message or just return
// - Create a new task object with:
//   - id from generateTaskId()
//   - title, description, dueDate
//   - status: 'to-do'
// - Push to tasks array, save, re-render
// - Reset the form and close the modal
function handleAddTask(event) {
    // Your code here
    event.preventDefault();

    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const dueDate = $('#taskDueDate').val().trim();

    if (!title || !description || !dueDate) {
        alert('Please fill out title, description, and due date.');
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title,
        description,
        dueDate, // in 'yyyy-mm-dd' from datepicker
        status: 'to-do'
    };

    tasks.push(newTask);
    saveState();
    renderTaskList();

    // Reset form
    $('#taskForm')[0].reset();

    // Close modal
    const modalEl = document.getElementById('taskModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

};




// TODO: handleDeleteTask(event)
// - Get the task id from the clicked button (data-task-id)
// - Remove that task from tasks array
// - Save and re-render
function handleDeleteTask(event) {
    // Your code here
    const taskId = Number($(event.currentTarget).data('taskId'));
    tasks = tasks.filter(task => task.id !== taskId);
    saveState();
    renderTaskList();
}

// TODO: handleDrop(event, ui)
// - Get the task id from the dragged card
// - Determine the new status from the lane's dataset/status or id
// - Update the task's status in the tasks array
// - Save and re-render
function handleDrop(event, ui) {
    // Your code here
    const $dragged = ui.draggable;
    const taskId = Number($dragged.data('taskId'))

    // Lane has data-status="to-do" / "in-progress" / "done"
    const newStatus = $(event.target)
        .closest('.lane')
        .data('status');

    tasks = tasks.map(task =>
        task.id === taskId ? {
            ...task,
            status: newStatus
        } : task
    );

    saveState();
    renderTaskList();

}


// ===== Document Ready =====

$(function () {
    // Show current date in header using Day.js
    $('#current-date').text(dayjs().format('[Today:] dddd, MMM D, YYYY'));

    // Initialize datepicker for due date
    // Hint: keep format consistent and use it in your parsing
    $('#taskDueDate').datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        minDate: 0
    });

    // Render tasks on load (will do nothing until you implement renderTaskList)
    renderTaskList();

    // Form submit handler
    $('#taskForm').on('submit', handleAddTask);

    // Delete handler (event delegation)
    $(document).on('click', '.btn-delete', handleDeleteTask);

    // Make lanes droppable
    // TODO: configure droppable to accept task cards and use handleDrop
    $('.lane-body').droppable({
        accept: '.task-card',
        drop: handleDrop,
        hoverClass: 'bg-light'
    });
});




// NOTE:  //- You are encouraged to use Day.js for ALL date logic.
// - You may adjust “due soon” rules, as long as they’re clearly implemented.