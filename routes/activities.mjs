import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Fetch the list list of 50 activities
router.get("/:userId", async (req, res) => {
  let activitiesCollection = await db.collection("activities");
  let usersCollection = await db.collection("users");
  let userId = req.params.userId;
  let userQuery = {
    _id: ObjectId(userId)
  };
  let user = await usersCollection.findOne(userQuery);
  
  // get the authed user's departmentIds
  let departmentIds = []
  user.departments.forEach((element) => {
    departmentIds.push(element.departmentId);
  })

  let results = await activitiesCollection.find({"departments.departmentId" : { $in : departmentIds  } })
    .limit(50)
    .toArray();

  res.send(results).status(200);
});

// Get a single activity
router.get("/:id", async (req, res) => {
  let collection = await db.collection("activities");
  let query = { _id: ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add hours spent to a activity for a member
router.get("/:activityId/member/:memberId/allocate-hours/:numberOfHoursSpent", async (req, res) => {
  let activityId = req.params.activityId;
  let memberId = req.params.memberId;
  let numberOfHoursSpent = parseInt(req.params.numberOfHoursSpent);

  let collection = await db.collection("activities");
  
  // find the item in the db
  let query = { _id: ObjectId(activityId) };
  let item = await collection.findOne(query);

  let i = 0;
  let unformattedMemberUpdates = [];
  
  item.members.forEach((itemMember) => {
    if (itemMember.memberId == memberId) {
      item.members[i].hoursSpent = item.members[i].hoursSpent + numberOfHoursSpent;
    }

    unformattedMemberUpdates.push(item.members[i])

    i++;
  })

  let updates = {
    $set: {
      members: unformattedMemberUpdates
    }
  }

  let result = await collection.updateOne(query, updates);
  
  res.send(result).status(200);
});

// Update the activity with a new member
router.post("/:activityId/members", async (req, res) => {
  const query = { _id: ObjectId(req.params.activityId) };
  const memberId = req.body.memberId;

  const updates = {
    $push: { members: {memberId: memberId} }
  };

  let collection = await db.collection("activities");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete member from a activity
router.delete("/:activityId/members/:memberId", async (req, res) => {
  const query = { _id: ObjectId(req.params.activityId) };
  const memberId = req.params.memberId;

  const updates = {
    $pull: { members: {memberId: memberId} }
  };

  let collection = await db.collection("activities");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

export default router;