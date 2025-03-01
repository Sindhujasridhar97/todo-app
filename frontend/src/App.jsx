import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const API_URL = "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editedTask, setEditedTask] = useState("");
  const [editedDueDate, setEditedDueDate] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data.map(todo => ({
      ...todo,
      dueDate: new Date(todo.dueDate)
    })));
  };

  const addTodo = async () => {
    if (!task.trim() || !dueDate) return;
    const adjustedDueDate = dueDate.toISOString();
    const response = await axios.post(API_URL, { task, dueDate: adjustedDueDate, completed: false });
    setTodos([...todos, { ...response.data, dueDate: new Date(response.data.dueDate) }]);
    setTask("");
    setDueDate(null);
  };

  const toggleComplete = async (id, completed) => {
    const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
    setTodos(todos.map(todo => (todo._id === id ? { ...response.data, dueDate: new Date(response.data.dueDate) } : todo)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  const saveEditedTask = async () => {
    if (!editedTask.trim() || !editedDueDate) return;
    const adjustedDueDate = editedDueDate.toISOString();
    const response = await axios.put(`${API_URL}/${selectedTask._id}`, {
      task: editedTask,
      dueDate: adjustedDueDate,
      completed: selectedTask.completed
    });
    setTodos(todos.map(todo => (todo._id === selectedTask._id ? { ...response.data, dueDate: new Date(response.data.dueDate) } : todo)));
    setSelectedTask(null);
  };

  const getTasksForDate = (date) => {
    return todos.filter(todo => {
      const taskDate = todo.dueDate;
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileClassName = ({ date }) => {
    const tasks = getTasksForDate(date);
    if (tasks.some(task => task.completed)) {
      return "completed";
    } else if (tasks.some(task => task.dueDate < new Date() && !task.completed)) {
      return "overdue";
    } else if (tasks.length > 0) {
      return "upcoming";
    }
    return "";
  };

  const formatDate = (date) => {
    return date instanceof Date && !isNaN(date) ? date.toLocaleString() : "Invalid Date";
  };

  const filterUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todos.filter(todo => {
      const taskDate = new Date(todo.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() >= today.getTime();
    });
  };

  const incompleteTasks = filterUpcomingTasks().filter(todo => !todo.completed);
  const completedTasks = filterUpcomingTasks().filter(todo => todo.completed);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Plan Wise</h1>
      </header>
      <main className="main-content">
        <section className="task-section">
          <div className="add-task">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Add a new task"
              aria-label="New task"
            />
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholderText="Select due date and time"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              aria-label="Due date"
              minDate={new Date()}
            />
            <button onClick={addTodo} aria-label="Add task">Add</button>
          </div>
          <ul className="task-list">
            {incompleteTasks.map(todo => (
              <li key={todo._id} className="task-item">
                <span
                  className={`task-text ${todo.completed ? "completed" : ""}`}
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                  aria-label={`Toggle complete for ${todo.task}`}
                >
                  {todo.task}
                </span>
                <span className="due-date">{formatDate(todo.dueDate)}</span>
                <FaCalendarAlt className="calendar-icon" aria-hidden="true" />
                <button
                  className="edit-btn"
                  onClick={() => {
                    setSelectedTask(todo);
                    setEditedTask(todo.task);
                    setEditedDueDate(todo.dueDate);
                  }}
                  aria-label={`Edit ${todo.task}`}
                >
                  <FaEdit />
                </button>
                <button
                  className="complete-btn"
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                  aria-label={`Mark ${todo.task} as complete`}
                >
                  <FaCheck />
                </button>
                <button className="delete-btn" onClick={() => deleteTodo(todo._id)} aria-label={`Delete ${todo.task}`}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          {completedTasks.length > 0 && (
            <div className="completed-tasks">
              <h2>Completed Tasks</h2>
              <ul className="task-list">
                {completedTasks.map(todo => (
                  <li key={todo._id} className="task-item completed">
                    <span
                      className="task-text"
                      onClick={() => toggleComplete(todo._id, todo.completed)}
                      aria-label={`Toggle complete for ${todo.task}`}
                    >
                      {todo.task}
                    </span>
                    <span className="due-date">{formatDate(todo.dueDate)}</span>
                    <FaCalendarAlt className="calendar-icon" aria-hidden="true" />
                    <button className="delete-btn" onClick={() => deleteTodo(todo._id)} aria-label={`Delete ${todo.task}`}>
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <aside className="calendar-section">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={tileClassName}
          />
        </aside>
      </main>
      {selectedTask && (
        <aside className="task-details">
          <h2>Task Details</h2>
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            aria-label="Task name"
          />
          <h3>Due Date</h3>
          <DatePicker
            selected={editedDueDate}
            onChange={(date) => setEditedDueDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="Pp"
            aria-label="Due date"
            minDate={new Date()}
          />
          <button className="delete-task" onClick={() => deleteTodo(selectedTask._id)} aria-label="Delete task">
            <FaTrash /> Delete Task
          </button>
          <button className="save-task" onClick={saveEditedTask} aria-label="Save changes">
            <FaCheck /> Save Changes
          </button>
        </aside>
      )}
      <footer className="app-footer">
        <p>&copy; 2023 Plan Wise. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
