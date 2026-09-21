require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const attemptRoutes = require("./routes/attempts");
const questionRoutes = require("./routes/questions");

const app = express();
const port = Number(process.env.PORT) || 4000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (request, response) => response.json({ ok: true, service: "cloudprep-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/questions", questionRoutes);
app.use((error, request, response, next) => { console.error(error); response.status(500).json({ error: "Unexpected server error." }); });

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get("*", (request, response) => response.sendFile(path.join(clientDist, "index.html")));
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cloudprep")
  .then(() => app.listen(port, () => console.log(`CloudPrep API running on http://localhost:${port}`)))
  .catch(error => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
