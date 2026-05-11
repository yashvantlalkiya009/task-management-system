# Task Manager — Laravel REST API + HTML Frontend

A simple Task Management system built with Laravel 12 (backend REST API) and plain HTML + Bootstrap + jQuery (frontend).

All operations work using AJAX without page reloads.

---

## Features

- View all tasks
- Add new task
- Edit existing task
- Delete task with confirmation
- Mark task complete / incomplete
- Filter tasks:
  - All
  - Completed
  - Incomplete
- Search tasks
- Pagination
- View full task details in modal
- Tasks sorted:
  - Incomplete first
  - Latest created first
- Toast notifications
- Responsive Bootstrap UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 |
| Database | MySQL |
| Frontend | HTML5, Bootstrap 5, jQuery |
| API | RESTful JSON API |

---

## Requirements

- PHP 8.1+
- Composer
- MySQL
- Node.js not required

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/yashvantlalkiya009/task-manager.git

cd task-manager
```

---

## 2. Install Dependencies

```bash
composer install
```

---

## 3. Create Environment File

```bash
cp .env.example .env
```

---

## 4. Configure Database

Open `.env` and update:

```env
DB_DATABASE=task_manager
DB_USERNAME=root
DB_PASSWORD=
```

---

## 5. Create Database

Run in MySQL:

```sql
CREATE DATABASE task_manager;
```

---

## 6. Generate App Key

```bash
php artisan key:generate
```

---

## 7. Run Migration

```bash
php artisan migrate
```

---

## 8. Start Laravel Server

```bash
php artisan serve
```

Application runs at:

```txt
http://127.0.0.1:8000
```

---

# Frontend URL

Frontend UI:

```txt
http://127.0.0.1:8000/index.html
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Fetch all tasks |
| GET | /api/tasks?filter=completed | Fetch completed tasks |
| GET | /api/tasks?filter=incomplete | Fetch incomplete tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/{id} | Fetch single task |
| PUT | /api/tasks/{id} | Update task |
| DELETE | /api/tasks/{id} | Delete task |

---

# Example Requests

## Create Task

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

---

## Update Task

```json
{
  "is_completed": true
}
```

---

# Validation Example

```json
{
  "message": "The title field is required.",
  "errors": {
    "title": [
      "The title field is required."
    ]
  }
}
```

---

# Project Structure

```txt
task-manager/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── TaskController.php
│   │   │
│   │   └── Resources/
│   │       └── TaskResource.php
│   │
│   └── Models/
│       └── Task.php
│
├── database/
│   └── migrations/
│       └── xxxx_create_tasks_table.php
│
├── routes/
│   ├── api.php
│   └── web.php
│
├── public/
│   ├── index.html
│   ├── app.js
│   │
│   └── css/
│       └── style.css
│
├── .env.example
├── composer.json
└── README.md
```

---

# Frontend Files

| File | Purpose |
|---|---|
| public/index.html | Main UI |
| public/app.js | AJAX + frontend logic |
| public/css/style.css | Custom styles |

---

# Run Project

```bash
php artisan serve
```

Open:

```txt
http://127.0.0.1:8000/index.html
```

---

# API Testing

You can test APIs using:

- Postman
- curl
- Browser DevTools

---

# Example curl Commands

## Get Tasks

```bash
curl http://127.0.0.1:8000/api/tasks
```

---

## Create Task

```bash
curl -X POST http://127.0.0.1:8000/api/tasks \
-H "Content-Type: application/json" \
-d "{\"title\":\"My Task\",\"description\":\"Demo\"}"
```

---

## Update Task

```bash
curl -X PUT http://127.0.0.1:8000/api/tasks/1 \
-H "Content-Type: application/json" \
-d "{\"is_completed\":true}"
```

---

## Delete Task

```bash
curl -X DELETE http://127.0.0.1:8000/api/tasks/1
```

---
