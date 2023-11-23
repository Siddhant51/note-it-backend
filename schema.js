const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  theme: String,
  createdAt: { type: Date, default: Date.now },
});

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    type: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
  const user = this;

  // Check if the password field is being modified or is new
  if (user.isModified("password")) {
    // Hash the password with bcrypt
    user.password = await bcrypt.hash(user.password, 8);
  }

  // Continue with the save operation
  next();
});

const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

module.exports = {
  User,
  Note,
};
