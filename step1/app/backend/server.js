import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "api", time: new Date().toISOString() });
});

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from NodeJS API 👋" });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
