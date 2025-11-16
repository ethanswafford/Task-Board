# Task-Board

# 02-Challenge: Task Board

## Overview

Build a simple, modern task board (a mini Kanban) that lets a team:

- Create tasks with a title, description, and due date
- Track each task’s progress by column
- See which tasks are overdue or approaching their deadline
- Persist tasks across page reloads

You’ll use:

- jQuery for DOM manipulation
- jQuery UI for drag-and-drop
- Day.js for all date handling

---

## User Story

AS A project team member with multiple tasks to organize
I WANT a task board
SO THAT I can add tasks, track their status, and quickly see what needs attention

---

## Acceptance Criteria

GIVEN a task board to manage project work:

- WHEN I open the task board
  THEN I see columns for each status: “To Do”, “In Progress”, and “Done”

- WHEN I view tasks on the board
  THEN each task is styled based on its due date:

  - Yellow if it’s due today or soon
  - Red if it’s past due

- WHEN I click the button to add a task
  THEN a modal dialog allows me to enter a title, description, and due date

- WHEN I save a new task
  THEN the task is added to the “To Do” column and saved in localStorage

- WHEN I drag a task card into another column
  THEN its status updates and persists after reload

- WHEN I click delete on a task
  THEN it’s removed from the board and from localStorage

- WHEN I refresh the page
  THEN all saved tasks are restored and displayed correctly

---

## Technical Requirements

- Use Day.js for:
  - Parsing and formatting due dates
  - Comparing dates to style tasks by urgency
- Use jQuery UI for drag-and-drop interactions
- Use Bootstrap 5 (or similar) for layout and styling

---

## Quality Guidelines

Your submission should:

- Load without console errors
- Have a clean, intuitive UI (mobile-friendly preferred)
- Follow best practices for:
  - File structure (assets/css, assets/js, etc.)
  - Semantic HTML
  - Consistent naming and indentation
  - Helpful comments

Include in your repository:

- A clear, descriptive README
- A screenshot of your app
- A link to the deployed version

---

## Submission

Submit both:

1. The URL to your deployed application
2. The URL to your GitHub repository containing your full source
