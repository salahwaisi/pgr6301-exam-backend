import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import departments from "./routes/departments.mjs";
import activities from "./routes/activities.mjs";
import users from "./routes/users.mjs";
import employees from "./routes/employees.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /departments routes
app.use("/departments", departments);

// Load the /activities routes
app.use("/activities", activities);

// Load the /employees routes
app.use("/employees", employees);

// Load the /users routes
app.use("/users", users);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});