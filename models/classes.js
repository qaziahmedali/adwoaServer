const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const classesSchema = new Schema(
  {
    class_name: { type: String },
    class_des: { type: String },
    class_format: { type: String },
    class_links: { type: String },
    class_type: { type: String }, //in-person || live || pre-recorded
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classesSchema, "classes");
