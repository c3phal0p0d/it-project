import express from "express";
import {db} from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) {
    res.status(400).send("Missing email query parameter");
    return;
  }

  let collection = await db.collection("events");
  let results = await collection.find({email: userEmail}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("events");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  let newDocument = {
    email: req.body.email,
    description: req.body.description,
    date: req.body.date,
    fromTime: req.body.fromTime,
    toTime: req.body.toTime,
    location: req.body.location,
  };
  let collection = await db.collection("events");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
        description: req.body.description,
        date: req.body.date,
        fromTime: req.body.fromTime,
        toTime: req.body.toTime,
        location: req.body.location
    }
  };

  let collection = await db.collection("events");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("events");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;