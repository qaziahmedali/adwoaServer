const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalInfoSchema = new Schema(
  {
    name: { type: String },
    date_of_birth: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    gender: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Personal", personalInfoSchema, "personals");
