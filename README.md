# Plan Wise The To-Do App

A simple **To-Do app** built using the **MERN** stack with **Vite** for the frontend.

## 🚀 Features
- Create, Read, Update, and Delete (CRUD) tasks

## 🛠 Tech Stack
- **Frontend:** Vite + React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas)

## 📂 Project Structure
```
todo-app/
├── backend/       # Node.js + Express Server
│   ├── models/    # Mongoose Models
│   ├── routes/    # API Routes
│   ├── server.js  # Main Server File
│   ├── .env       # Environment Variables
├── frontend/      # Vite + React
│   ├── src/       # React Components & Pages
│   ├── App.jsx    # Main App Component
│   ├── main.jsx   # React Entry Point
│   ├── index.css  # Global Styles
├── package.json   # Dependencies & Scripts
```

---

## 🛠 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/mern-todo-app.git
cd mern-todo-app
```

### 2️⃣ Backend Setup (Node.js + MongoDB)
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend/` folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

#### Run the Backend Server
```bash
nodemon server.js
# or
node server.js
```
Server will start at `http://localhost:5000`

### 3️⃣ Frontend Setup (Vite + React)
💡 **Happy Coding!** 🚀
