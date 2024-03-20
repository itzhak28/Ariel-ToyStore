const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema(
  {
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    user_id: String,
  },
  { timestamps: true }
);

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validateToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    info: Joi.string().required(),
    category: Joi.string().min(2).max(30).required(),
    img_url: Joi.string().min(2).max(400).allow(null, ""),
    price: Joi.number().min(1).max(999).required(),
  });
  return joiSchema.validate(_reqBody);
};
