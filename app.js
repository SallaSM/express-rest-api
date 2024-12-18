const express = require("express");
const app = express();
const {
  body,
  query,
  matchedData,
  validationResult,
} = require("express-validator");
const port = process.env.PORT || 3000;
const path = require("path");

let counter = 2;

let db = [
  { id: 1, latitude: 40.7128, longitude: -74.006 },
  { id: 2, latitude: 32.7828, longitude: -118.006 },
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/locations", (req, res) => {
  res.send(db);
});

app.get("/api/locations/:urlId([0-9]+)", (req, res) => {
  const id = Number(req.params.urlId); //
  const temp = db.find((customer) => customer.id === id);
  if (temp) {
    res.send(temp);
  } else {
    res.status(404).end();
  }
});

app.post(
  "/api/locations",
  [
    body("latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude")
      .toFloat(),
    body("longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude")
      .toFloat(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const location = {
      ...data,
      id: counter++,
    };

    db.push(location);
    res.json(location);
  },
);

app.delete("/api/locations/:urlId([0-9]+)", (req, res) => {
  const id = Number(req.params.urlId); //
  db = db.filter((location) => location.id != id);
  res.status(204).end();
});

const server = app.listen(port, () => {
  console.log(`My app listening on port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down Express.js server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
