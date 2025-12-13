import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  email: String,
  password: String
});

export default mongoose.model("Admin", adminSchema);
