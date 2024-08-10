const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db"); // Certifique-se de ter um arquivo db.js que exporta a conexão com o banco de dados

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Servir o arquivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all cars
app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get a single car by ID
app.get("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cars WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Car not found");
    res.json(results[0]);
  });
});

// Create a new car
app.post("/cars", (req, res) => {
  const { brand, model, year } = req.body;
  const sql = "INSERT INTO cars (brand, model, year) VALUES (?, ?, ?)";
  db.query(sql, [brand, model, year], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, brand, model, year });
  });
});

// Update a car by ID
app.put("/cars/:id", (req, res) => {
  const { id } = req.params;
  const { brand, model, year } = req.body;
  const sql = "UPDATE cars SET brand = ?, model = ?, year = ? WHERE id = ?";
  db.query(sql, [brand, model, year, id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.affectedRows === 0)
      return res.status(404).send("Car not found");
    res.json({ id, brand, model, year });
  });
});

// Delete a car by ID
app.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cars WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.affectedRows === 0)
      return res.status(404).send("Car not found");
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
