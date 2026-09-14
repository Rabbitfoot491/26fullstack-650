const express = require("express");

const app = express();

const PORT = 3000;

// Serve HTML and CSS from public folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
});