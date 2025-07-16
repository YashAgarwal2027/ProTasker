import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_BASE_URL}/api/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
      setShowForm(false);
      fetchTasks();
    } catch {
      alert("Failed to add task");
    }
  };

  const handleEditClick = (task) => {
    setEditTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
    });
  };

  const handleEditChange = (e) =>
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdateTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`${API_BASE_URL}/api/tasks/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditTaskId(null);
    } catch {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/tasks/${task._id}`,
        { ...task, completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch {
      setError("Failed to toggle completion");
    }
  };

  const priorityBadge = {
    High: "🔥 High",
    Medium: "⚠️ Medium",
    Low: "💤 Low",
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold">Your Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage them efficiently</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {showForm ? "Close Form" : "+ Add Task"}
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "Completed", "Not Completed"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-3 py-1 rounded text-sm ${
              filter === option
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 mb-6">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Task
          </button>
        </form>
      )}

      {/* Task List */}
      <ul className="space-y-4">
        {tasks
          .filter((t) => {
            if (filter === "Completed") return t.completed;
            if (filter === "Not Completed") return !t.completed;
            return true;
          })
          .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            if (dateA - dateB !== 0) return dateA - dateB;
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .map((task) => (
            <li key={task._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2 transition-opacity">
              {editTaskId === task._id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <input
                    type="date"
                    name="dueDate"
                    value={editForm.dueDate}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateTask(task._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Save
                    </button>
                    <button onClick={() => setEditTaskId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleEditClick(task)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`px-3 py-1 rounded text-sm text-white ${
                          task.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {task.completed ? "Mark Incomplete" : "Mark Complete"}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                  <p className="text-sm">
                    Priority: <span className="font-medium">{priorityBadge[task.priority]}</span>
                  </p>
                  <p className="text-sm">Due: {new Date(task.dueDate).toDateString()}</p>
                  <p
                    className={`text-sm font-medium ${
                      task.completed ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </p>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Home;
