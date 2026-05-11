# Task Manager — Laravel REST API + HTML Frontend

A simple Task Management system built with **Laravel** (backend REST API) and **plain HTML + Bootstrap + jQuery** (frontend). No page reloads — everything runs via AJAX.

---

## Features

- View all tasks in a table
- Add new tasks
- Edit existing tasks
- Delete tasks (with confirmation dialog)
- Mark tasks as completed / incomplete (checkbox or button)
- Filter by: All / Completed / Incomplete
- Tasks sorted: incomplete first, then by newest
- Live stats: Total / Pending / Completed counts
- Toast notifications for every action
- Form validation (client-side + Laravel server-side)

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Laravel 12, MySQL                 |
| Frontend | HTML5, Bootstrap 5, jQuery 3.7    |
| API      | RESTful JSON API                  |

---

## Requirements

- PHP 8.1 or higher
- Composer
- MySQL 
- A terminal / command prompt

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Create your environment file

```bash
cp .env.example .env
```

Then open `.env` and update your database credentials:

```
DB_DATABASE=task_manager
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

### 4. Create the database

Log in to MySQL and run:

```sql
CREATE DATABASE task_manager;
```

### 5. Generate application key

```bash
php artisan key:generate
```

### 6. Run migrations

```bash
php artisan migrate
```

This creates the `tasks` table with columns: `id`, `title`, `description`, `is_completed`, `created_at`, `updated_at`.

### 7. Start the development server

```bash
php artisan serve
```

The API is now running at **http://127.0.0.1:8000**

### 8. Open the frontend

Open `public/index.html` directly in your browser.

> No web server needed for the frontend — it's a plain HTML file.

---

## API Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/tasks`          | Fetch all tasks (sorted)           |
| GET    | `/api/tasks?filter=completed`  | Fetch completed tasks only |
| GET    | `/api/tasks?filter=incomplete` | Fetch incomplete tasks only |
| POST   | `/api/tasks`          | Create a new task                  |
| GET    | `/api/tasks/{id}`     | Fetch a single task                |
| PUT    | `/api/tasks/{id}`     | Update a task                      |
| DELETE | `/api/tasks/{id}`     | Delete a task                      |

### Request / Response Examples

**POST /api/tasks**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**PUT /api/tasks/1** (toggle complete)
```json
{
  "is_completed": true
}
```

**Validation error response (422)**
```json
{
  "message": "The title field is required.",
  "errors": {
    "title": ["The title field is required."]
  }
}
```

---

## Project Structure

```
task-manager/
├── app/
│   ├── Http/Controllers/
│   │   └── TaskController.php      ← All API logic
│   └── Models/
│       └── Task.php                ← Eloquent model
├── config/
│   └── cors.php                    ← CORS configuration
├── database/migrations/
│   └── ..._create_tasks_table.php  ← DB schema
├── routes/
│   └── api.php                     ← Route::apiResource('tasks', ...)
├── public/
│   ├── index.html                  ← Frontend UI
│   └── app.js                      ← All AJAX / jQuery logic
├── .env.example
└── README.md
```

---

## Testing the API (Postman / curl)

```bash
# Get all tasks
curl http://127.0.0.1:8000/api/tasks

# Create a task
curl -X POST http://127.0.0.1:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","description":"Test it"}'

# Toggle complete
curl -X PUT http://127.0.0.1:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"is_completed":true}'

# Delete
curl -X DELETE http://127.0.0.1:8000/api/tasks/1
```

---

## License

MIT