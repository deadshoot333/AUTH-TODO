const express = require("express");
const { runQuery } = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  console.log("Fetching todos for userEmail:", userEmail);
  try {
    const todos = await runQuery(
      `SELECT * FROM AUTH_TODOS WHERE USER_EMAIL = :email`,
      { email: userEmail }
    );
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/todos", async (req, res) => {
  const { user_email, title, progress, todo_date } = req.body;
  const id = uuidv4();

  try {
    await runQuery(
      `INSERT INTO AUTH_TODOS (ID, USER_EMAIL, TITLE, PROGRESS, TODO_DATE) VALUES (:id, :user_email, :title, :progress, :todo_date)`,
      { id, user_email, title, progress, todo_date }
    );
    res
      .status(201)
      .json({ message: "Todo added successfully ", title, user_email });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, todo_date } = req.body;
  try {
    const editToDo = await runQuery(
      `UPDATE AUTH_TODOS 
      SET USER_EMAIL=:user_email,TITLE=:title,PROGRESS=:progress,TODO_DATE=:todo_date
      WHERE ID =:id`,
      { user_email, title, progress, todo_date, id }
    );
    res.json(editToDo);
  } catch (error) {
    console.error(error);
  }
});
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await runQuery(`DELETE FROM AUTH_TODOS WHERE ID = :id`, { id });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await runQuery(`SELECT * FROM USERS WHERE EMAIL=:email`, {
      email,
    });
    if (!users.length) {
      return res.json({ detail: "User does not exist" });
    }
    const success = await bcrypt.compare(
      password,users[0]['HASHED_PASSWORD']
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({ email: users[0]['EMAIL'], token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
});
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const signup = await runQuery(
      `INSERT INTO USERS(EMAIL,HASHED_PASSWORD) VALUES (:email,:hashedPassword)`,
      { email, hashedPassword }
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (error) {
    res.json({ detail: error.detail });
    console.error(error);
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
