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
    dueDate: ""
  });

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      setFormData({ title: "", description: "", priority: "Medium", dueDate: "" });
      fetchTasks(); // refresh task list
    } catch (err) {
      alert("Failed to add task");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
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

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet. Start adding some!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm">
                Priority: <span className="font-medium">{task.priority}</span>
              </p>
              <p className="text-sm">Due: {new Date(task.dueDate).toDateString()}</p>
              <p className="text-sm text-green-600">
                {task.completed ? "Completed" : "Pending"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;

