import express from "express";
import cors from "cors";
import path from "path";

import connection from "./db/connection.js";
import authRoute from "./routes/auth.route.js";
import taskRoute from "./routes/task.route.js";
// import job from "./cron.js";

const app = express();
const __dirname = path.resolve();
const PORT = 3000;
// job.start();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/task", taskRoute);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  connection();
  console.log(`Listening on port ${PORT}`);
});
