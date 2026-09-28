import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const FILE = "requests.json";

const readRequests = () => JSON.parse(fs.readFileSync(FILE, "utf-8") || "[]");
const writeRequests = (data) =>
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// GET all requests
app.get("/api/requests", (req, res) => {
  res.json(readRequests());
});

// GET one request
app.get("/api/requests/:id", (req, res) => {
  const request = readRequests().find((r) => r.id === parseInt(req.params.id));
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(request);
});

// POST new request
app.post("/api/requests", (req, res) => {
  const requests = readRequests();

  const newRequest = {
    id: requests.length ? Math.max(...requests.map((r) => r.id)) + 1 : 1,
    studentName: req.body.studentName,
    email: req.body.email,
    category: req.body.category,
    description: req.body.description,
    priority: req.body.priority,
  };

  requests.push(newRequest);
  writeRequests(requests);
  res.status(201).json(newRequest);
});

// PUT update request
app.put("/api/requests/:id", (req, res) => {
  const requests = readRequests();
  const index = requests.findIndex((r) => r.id === parseInt(req.params.id));

  if (index === -1) return res.status(404).json({ message: "Request not found" });

  requests[index] = {
    ...requests[index],
    studentName: req.body.studentName,
    email: req.body.email,
    category: req.body.category,
    description: req.body.description,
    priority: req.body.priority,
  };

  writeRequests(requests);
  res.json(requests[index]);
});

// DELETE request
app.delete("/api/requests/:id", (req, res) => {
  const requests = readRequests();
  const id = parseInt(req.params.id);

  if (!requests.some((r) => r.id === id)) {
    return res.status(404).json({ message: "Request not found" });
  }

  writeRequests(requests.filter((r) => r.id !== id));
  res.json({ message: "Request deleted successfully" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});