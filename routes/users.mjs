import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a single user
router.get("/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = {_id: ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Creates an user
router.post("/", async (req, res) => {
  let collection = await db.collection("users");
  let user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    departments: req.body.departments,
    accountType: req.body.accountType
  }
  
  let result = await collection.insertOne(user)

  if (result) {
      res.send(result).status(200);
  } else {
    res.send(401, "Not valid user");
  }
});

// Updates an user
router.put("/", async (req, res) => {
  let collection = await db.collection("users");
  const query = { _id: req.body._id };

  const updates = {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      departments: req.body.departments,
      accountType: req.body.accountType
    }
  };
  
  let result = await collection.updateOne(query, updates)

  if (result) {
      res.send(result).status(200);
  } else {
    res.send(401, "Not valid user");
  }
});

// User login route
router.post("/login", async (req, res) => {
  let collection = await db.collection("users");
  let userCredentials = req.body;
  let query = {
    email: userCredentials.email,
    password: userCredentials.password
  }
  
  let result = await collection.findOne(query);

  if (result) {
      res.send(result).status(200);
  } else {
    res.send(401, "Not valid user");
  }

});

export default router;