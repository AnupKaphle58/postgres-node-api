import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

import pool from "./database/db.js";
import userRoutes from "./routes/users.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use(helmet());

app.use("/users", userRoutes);
// app.use("/admin", adminRoutes);

app.get("/", async (req, res) => {
  const users = await pool.query(`SELECT * FROM users`);
  res.send(users.rows);
});

app.all("*", (req, res) => {
  res.status(400).send("Page not found");
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
