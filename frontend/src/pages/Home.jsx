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
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
  });

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [filter, setFilter] = useState("All");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:5000/api/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
      setShowForm(false); // 👈 auto-hide after adding
      fetchTasks(); // refresh task list
    } catch (err) {
      alert("Failed to add task");
    }
  };

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted task from state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };
  // When the Edit button is clicked, we’ll load that task into the form:
  const handleEditClick = (task) => {
    setEditTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0], // to fit input type="date"
    });
  };
  //This update the edit form inputs:
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // this will send a PUT request to update the task:
  const handleUpdateTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local task list
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? response.data : task))
      );
      setEditTaskId(null); // Exit edit mode
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update task.");
    }
  };

  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { ...task, completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? response.data : t))
      );
    } catch (error) {
      console.error("Failed to toggle completion:", error);
      setError("Unable to update completion status.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Tasks</h1>
          <p className="text-lg text-gray-700 mt-1">Manage Your Tasks</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? "Close Form" : "+ Add Task"}
          </button>
        </div>
      </div>
      {/* Task Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          ></textarea>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>
      )}
      <div className="flex space-x-2 mb-4">
        {["All", "Completed", "Not Completed"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-1 rounded text-sm font-medium ${
              filter === option
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet. Start adding some!</p>
      ) : (
        <ul className="space-y-4">
          {[...tasks]
            .filter((task) => {
              if (filter === "Completed") return task.completed;
              if (filter === "Not Completed") return !task.completed;
              return true;
            })
            .sort((a, b) => {
              if (filter === "Not Completed") {
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                if (dateA - dateB !== 0) return dateA - dateB;
          
                // If same due date, use priority order: High < Medium < Low
                const priorityOrder = { High: 1, Medium: 2, Low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              }
              return a.completed - b.completed; // default sort: incomplete first
            })
            .map((task) => (
              <li
                key={task._id}
                className={`bg-white p-4 rounded shadow transition-opacity ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                {editTaskId === task._id ? (
                  // Editable Task UI
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full border p-2 rounded"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="w-full border p-2 rounded"
                    ></textarea>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                      className="w-full border p-2 rounded"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                      className="w-full border p-2 rounded"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateTask(task._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditTaskId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-xl font-semibold ${
                            task.completed ? "line-through text-gray-600" : ""
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.completed && (
                          <span className="text-green-600 font-bold">✔️</span>
                        )}
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditClick(task)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`px-3 py-1 rounded text-sm ${
                            task.completed
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {task.completed ? "Mark Incomplete" : "Mark Complete"}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-sm">
                      Priority:{" "}
                      <span className="font-medium">{task.priority}</span>
                    </p>
                    <p className="text-sm">
                      Due: {new Date(task.dueDate).toDateString()}
                    </p>
                    <p
                      className={`text-sm ${
                        task.completed ? "text-yellow-600" : "text-green-600"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </p>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
