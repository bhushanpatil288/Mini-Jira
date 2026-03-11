# Mini Jira — MERN Stack Project

A simplified Jira clone built with the MERN stack (MongoDB, Express, React, Node.js) for learning full-stack development.

## Features

- 🔐 JWT Authentication (signup, login, protected routes)
- 📋 Create and manage boards
- ✅ Task management with 3-column scrum board (Todo, InProgress, Done)
- 🖱️ Drag-and-drop between columns (@dnd-kit)
- 👥 Add members to boards by email
- 🎨 Clean, minimal UI with vanilla CSS

## Project Structure

```
Mini Jira/
├── server/                 # Backend (Express + MongoDB)
│   ├── controllers/        # Route handlers (business logic)
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Board.js
│   │   └── Task.js
│   ├── routes/             # Express route definitions
│   │   ├── auth.js
│   │   ├── boards.js
│   │   └── tasks.js
│   ├── index.js            # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js    # Axios instance with token interceptor
│   │   ├── components/
│   │   │   ├── Column.jsx      # Droppable scrum column
│   │   │   ├── Navbar.jsx      # Top navigation bar
│   │   │   ├── PrivateRoute.jsx # Auth route guard
│   │   │   └── TaskCard.jsx    # Draggable task card
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── pages/
│   │   │   ├── BoardDetailPage.jsx  # Scrum board with DnD
│   │   │   ├── BoardsPage.jsx      # Board listing
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   └── SignupPage.jsx      # Signup form
│   │   ├── App.jsx         # Root component + routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # All styles (CSS variables)
│   ├── index.html
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally on port 27017 (or a MongoDB Atlas URI)

## Setup Instructions

### 1. Clone and set up environment

```bash
# Navigate to the project
cd "Mini Jira"

# Copy environment variables
cp server/.env.example server/.env
# Edit server/.env if you need to change the MongoDB URI or JWT secret
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
```

The app opens at **http://localhost:5173**

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in, receive JWT |

### Boards (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get user's boards |
| GET | `/api/boards/:id` | Get single board |
| POST | `/api/boards` | Create a board |
| PUT | `/api/boards/:id/members` | Add member by email |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:boardId` | Get tasks for a board |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update task (status, etc.) |
| DELETE | `/api/tasks/:id` | Delete a task |

## How to Extend

This project is designed to be easily extended. Here are some ideas:

- **Priority levels** — Add a `priority` field (Low/Medium/High) to the Task model
- **Due dates** — Add a `dueDate` field and show overdue tasks in red
- **Comments** — Create a Comment model (ref Task, ref User) with a comments array
- **Labels/Tags** — Add a `labels` array field to tasks for categorization
- **Search & Filter** — Add search bar and filter by assignee/status
- **Notifications** — Notify users when assigned to a task (Socket.io or polling)
- **File attachments** — Add Multer for file uploads on tasks
