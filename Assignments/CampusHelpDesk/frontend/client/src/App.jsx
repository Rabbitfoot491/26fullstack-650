import { useEffect, useState } from "react";
import "./App.css";

const emptyForm = {
  studentName: "",
  email: "",
  category: "Hostel",
  description: "",
  priority: "Medium",
};

function App() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // Get all requests
  const getRequests = async () => {
    const response = await fetch("/api/requests");
    const data = await response.json();
    setRequests(data);
  };

  useEffect(() => {
    getRequests();
  }, []);

  // One handler for all inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `/api/requests/${editId}` : "/api/requests";
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setEditId(null);
    getRequests();
  };

  // Load a request into the form for editing
  const startEdit = (request) => {
    setForm({
      studentName: request.studentName,
      email: request.email,
      category: request.category,
      description: request.description,
      priority: request.priority,
    });
    setEditId(request.id);
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  // Delete request
  const deleteRequest = async (id) => {
    await fetch(`/api/requests/${id}`, { method: "DELETE" });
    getRequests();
  };

  return (
    <div className="container">
      <header>
        <h1>Campus Help Desk</h1>
        <p>Submit and manage campus problems and requests</p>
      </header>

      <div className="card">
        <h2>{editId ? "Edit Request" : "New Request"}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Student Name
            <input
              type="text"
              name="studentName"
              placeholder="e.g. Krishna"
              value={form.studentName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Hostel</option>
              <option>Library</option>
              <option>Academics</option>
              <option>Transport</option>
              <option>Canteen</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="full">
            Problem Description
            <textarea
              name="description"
              placeholder="Describe the problem..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <div className="full actions">
            <button type="submit" className="btn primary">
              {editId ? "Update Request" : "Submit Request"}
            </button>
            {editId && (
              <button type="button" className="btn" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>All Requests ({requests.length})</h2>

        {requests.length === 0 ? (
          <p className="empty">No requests yet. Submit one above.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>
                      <strong>{r.studentName}</strong>
                      <div className="muted">{r.email}</div>
                    </td>
                    <td>{r.category}</td>
                    <td className="desc">{r.description}</td>
                    <td>
                      <span className={`badge ${r.priority.toLowerCase()}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${r.priority.toLowerCase()}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button className="btn small edit" onClick={() => startEdit(r)}>Edit</button>
                      <button className="btn small delete" onClick={() => deleteRequest(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;