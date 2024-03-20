const express = require("express");
const router = express.Router();
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");

const pageLimit = 10;

router.get("/", async (req, res) => {
  const { skip, s } = req.query;
  const skipNumber = skip > 0 ? (skip - 1) * pageLimit : 0;

  let dbQuery = {};
  if (s) {
    dbQuery = {
      $or: [
        { name: { $regex: s, $options: "i" } },
        { info: { $regex: s, $options: "i" } },
      ],
    };
  }

  try {
    const data = await ToyModel.find(dbQuery).skip(skipNumber).limit(pageLimit);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
});

router.get("/category/:catname", async (req, res) => {
  const { catname } = req.params;
  const { skip } = req.query;
  const skipNumber = skip > 0 ? (page - 1) * pageLimit : 0;

  const dbQuery = { category: catname };
  try {
    const data = await ToyModel.find(dbQuery).skip(skipNumber).limit(pageLimit);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
});

router.post("/", auth, async (req, res) => {
  const tokenData = req.tokenData;
  const body = req.body;
  const validBody = validateToy(body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const toy = new ToyModel(body);

    toy.user_id = tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.put("/:id", auth, async (req, res) => {
  const tokenData = req.tokenData;
  const body = req.body;
  const { id } = req.params;

  const validBody = validateToy(body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const data = await ToyModel.updateOne(
      { _id: id, user_id: tokenData._id },
      body
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const tokenData = req.tokenData;
  const { id } = req.params;
  try {
    let data;

    if (tokenData.role == "admin" || tokenData.role == "superadmin") {
      data = await ToyModel.deleteOne({ _id: id });
    } else {
      data = await ToyModel.deleteOne({
        _id: id,
        user_id: tokenData._id,
      });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/prices", async (req, res) => {
  const { skip, min, max } = req.query;
  const skipNumber = skip > 0 ? (skip - 1) * pageLimit : 0;

  const dbQuery = { price: { $gte: min, $lte: max } };
  try {
    const data = await ToyModel.find(dbQuery).skip(skipNumber).limit(pageLimit);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
});

router.get("/single/:id", async (req, res) => {
  const { id } = req.params;

  const dbQuery = { _id: id };
  try {
    const data = await ToyModel.findOne(dbQuery);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await ToyModel.countDocuments({});
    res.json({ count });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
