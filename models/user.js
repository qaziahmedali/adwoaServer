import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: { type: String, required: false, default:"/uploads/avatar.png" },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },
    totalPoints: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    challengeStatus: { type: Boolean, default: false },
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
