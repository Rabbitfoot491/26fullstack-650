import { useState } from "react";
import "./App.css";

const App = () => {
  const [search, setSearch] = useState("");

  const documents = [
    {
      name: "FSD",
      file: "FSD-Notes.pdf"
    },
    {
      name: "React",
      file: "React-Notes.pdf"
    },
    {
      name: "JavaScript",
      file: "JavaScript-Notes.pdf"
    },
    {
      name: "Express",
      file: "Express-Notes.pdf"
    }
  ];

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Notes Portal App</h1>

      <input
        type="text"
        placeholder="🔍︎ Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredDocuments.map((doc) => (
        <div key={doc.file}>
          <h3>{doc.name}</h3>

          <a
            href={`http://localhost:5000/files/${doc.file}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default App;